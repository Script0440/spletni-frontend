import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/messages';
const PAGE_SIZE = 20;

export const useMessages = (chatId: number | string) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['messages', chatId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(`${BASE_URL}/${chatId}`, {
        params: { offset: pageParam, limit: PAGE_SIZE },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    enabled: !!chatId,
  });

  const messages = data?.pages.flat() || [];

  // 📨 Добавление нового сообщения (оптимизировано)
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      content,
      UUId,
      images,
      replyMessageId,
    }: {
      content: string;
      UUId: string;
      images?: File[] | null;
      replyMessageId?: string;
    }) => {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('UUId', UUId);
      if (replyMessageId) formData.append('replyMessageId', replyMessageId);
      images?.forEach((file) => formData.append('files', file));
      const res = await axios.post(`${BASE_URL}/${chatId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },

	 onSuccess: (newMessage) => {
		// Обновляем chat.media
		queryClient.setQueryData(['chat', chatId], (oldData: any) => {
		  if (!oldData) return oldData;
	 
		  const oldMedia = oldData.media || [];
		  const newMedia = (newMessage.images || []).map((img: any) => ({
			 mediaUrl: img.imageUrl,
			 mediaType: 'image',
		  }));
	 
		  return {
			 ...oldData,
			 media: [...oldMedia, ...newMedia],
		  };
		});
	 
		console.log(newMessage)

      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return oldData;

        const firstPage = oldData.pages[0];
        const exists = firstPage.some((msg: any) => msg.messageUId === newMessage.messageUId);
        if (exists) return oldData; // избегаем дублей



        return {
          ...oldData,
          pages: [
            [newMessage, ...firstPage],
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  // ✏️ Редактирование
  const editMessageMutation = useMutation({
    mutationFn: async ({
      messageId,
      updatedContent,
    }: {
      messageId: string;
      updatedContent: string;
    }) => {
      const res = await axios.patch(`${BASE_URL}/${chatId}/${messageId}`, {
        updatedContent,
      });
      return res.data;
    },

    onSuccess: (updatedMessage) => {
      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return oldData;

        let isChanged = false;

        const updatedPages = oldData.pages.map((page: any[]) =>
          page.map((msg) => {
            if (msg.messageUId === updatedMessage.messageUId) {
              const hasChanges =
                msg.content !== updatedMessage.content || !msg.isEdit;
              if (hasChanges) {
                isChanged = true;
                return { ...msg, content: updatedMessage.content, isEdit: true };
              }
            }
            return msg;
          })
        );

        return isChanged ? { ...oldData, pages: updatedPages } : oldData;
      });
    },
  });


  const readAllMessagesMutation = useMutation({
	mutationFn: async (userId: string) => {
	  console.log('readAllMessagesMutation: Вызвано для userId:', userId);
	  return userId;
	},
	onSuccess: (userId: string) => {
	  console.log('readAllMessagesMutation: Обновление queryClient для userId:', userId);
	  queryClient.setQueryData(['messages', chatId], (oldData: any) => {
		 if (!oldData || !oldData.pages) {
			console.log('readAllMessagesMutation: Нет данных или pages в oldData', oldData);
			return oldData;
		 }
 
		 const updatedPages = oldData.pages.map((page: any[]) =>
			page.map((msg) => {
			  const alreadyRead = Array.isArray(msg.isRead) && msg.isRead.includes(userId);
			  return {
				 ...msg,
				 isRead: alreadyRead ? msg.isRead : [...(msg.isRead || []), userId],
			  };
			})
		 );
 
		 console.log('readAllMessagesMutation: Обновлённые страницы:', updatedPages);
		 return { ...oldData, pages: updatedPages };
	  });
	},
	onError: (error) => {
	  console.error('readAllMessagesMutation: Ошибка:', error);
	},
 });

  // не отправляем на бэк, меняем на клиентской части.
  const readMessagesMutation = useMutation({
	mutationFn: async ({
	  messagesId,
	  userId,
	}: {
	  messagesId: string[];
	  userId: string;
	}) => {
	  return { messagesId, userId };
	},
 
	onSuccess: ({ messagesId, userId }) => {
		console.log('453')
	  queryClient.setQueryData(['messages', chatId], (oldData: any) => {
		 if (!oldData) return oldData;
 
		 const updatedPages = oldData.pages.map((page: any[]) =>
			page.map((msg) => {
			  if (messagesId.includes(msg.messageUId)) {
				 return {
					...msg,
					isRead: [...(msg.isRead || []), userId],
				 };
			  }
			  return msg;
			})
		 );
 
		 return { ...oldData, pages: updatedPages };
	  });
	},
 });

  // 🗑️ Удаление
  const deleteMessageMutation = useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      await axios.delete(`${BASE_URL}/${chatId}/${messageId}`);
      return messageId;
    },

    onSuccess: (deletedMessageId) => {
      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return oldData;

        let isChanged = false;

        const updatedPages = oldData.pages.map((page: any[]) => {
          const filtered = page.filter((msg) => msg.messageUId !== deletedMessageId);
          if (filtered.length !== page.length) isChanged = true;
          return filtered;
        });

        return isChanged ? { ...oldData, pages: updatedPages } : oldData;
      });
    },
  });

  return {
    messages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,

    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isLoading,
    sendError: sendMessageMutation.error,

    editMessage: editMessageMutation.mutateAsync,
    isEditing: editMessageMutation.isLoading,
    editError: editMessageMutation.error,

	 readMessages: readMessagesMutation.mutateAsync,
		isReading: readMessagesMutation.isLoading,
		readError: readMessagesMutation.error,

		readAllMessages: readAllMessagesMutation.mutateAsync,
		isReadingAll: readAllMessagesMutation.isLoading,

    deleteMessage: deleteMessageMutation.mutateAsync,
    isDeleting: deleteMessageMutation.isLoading,
    deleteError: deleteMessageMutation.error,
  };
};
