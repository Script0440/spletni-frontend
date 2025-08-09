import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUser = (uId?: string) => {
	const queryClient = useQueryClient();
 
	const queryKey = ['user', uId || 'me'];
 
	const query = useQuery<{ user: any }, Error>({
	  queryKey,
	  queryFn: async () => {
		 const endpoint = uId
			? `${process.env.NEXT_PUBLIC_BASE_URL}/user/getUser?uId=${uId}`
			: `${process.env.NEXT_PUBLIC_BASE_URL}/user/getMe`;
 
		 const res = await axios.get(endpoint, { withCredentials: true });
		 if (!res.data || !res.data.user) {
			throw new Error('Не удалось получить пользователя');
		 }
 
		 console.log('Я вызвался');
		 return { user: res.data.user };
	  },
	  enabled: !!uId || uId === undefined,
	  staleTime: 5 * 60 * 1000, // 5 минут — повторно не вызывает queryFn
	  cacheTime: 10 * 60 * 1000, // 10 минут — держит кэш
	});

	const updateUserChats = (chatId: string, patch: Partial<{ isArchived: boolean }>) => {
		queryClient.setQueryData(queryKey, (oldData: any) => {
			if (!oldData?.user) return oldData;
		 
			const updatedChats = oldData.user.chats.map((chat: any) =>
			  chat.chatId === chatId ? { ...chat, ...patch } : chat
			);
		 
			return {
			  ...oldData,
			  user: {
				 ...oldData.user,
				 chats: updatedChats,
			  },
			};
		 });
	 };

	 const updatePinnedChatId = (chatId: string, isPinned: boolean) => {
		queryClient.setQueryData(queryKey, (oldData: any) => {
		  if (!oldData?.user) return oldData;
	 
		  let newPinnedChatId;
		  if (isPinned) {
			 // Добавляем chatId если его нет в списке
			 newPinnedChatId = oldData.user.pinnedChatId.includes(chatId)
				? oldData.user.pinnedChatId
				: [...oldData.user.pinnedChatId, chatId];
		  } else {
			 // Убираем chatId из списка
			 newPinnedChatId = oldData.user.pinnedChatId.filter((id: string) => id !== chatId);
		  }
	 
		  return {
			 ...oldData,
			 user: {
				...oldData.user,
				pinnedChatId: newPinnedChatId,
			 },
		  };
		});
	 };
	 

	const mutation = useMutation({
	  mutationFn: async (formData: FormData) => {
		 const res = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/user/updateMe`,
			formData,
			{
			  withCredentials: true,
			  headers: { 'Content-Type': 'multipart/form-data' },
			}
		 );
		 return res.data;
	  },
	  onSuccess: () => {
		 queryClient.invalidateQueries(queryKey);
	  },
	});
 
	return {
	  user: query.data?.user,
	  isLoading: query.isLoading,
	  error: query.error,
	  updateUserChats,
	  updatePinnedChatId,
	  refetch: query.refetch,
	  updateUser: mutation.mutateAsync,
	  isUpdating: mutation.isLoading,
	};
 };
 