import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from './useUser'; // возвращает { user }

const BASE_URL = 'http://localhost:3001/chat';

export const useChats = () => {
  const { user,updateUserChats,updatePinnedChatId, isLoading: isUserLoading, error: userError } = useUser();
  const queryClient = useQueryClient();

  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
	queryKey: ['chats', user?.chats, user?.pinnedChatId],
    queryFn: async () => {
      if (!user?.chats?.length) return [];

      const ids = user.chats.map((c: any) => c.chatId);

      const res = await axios.post(`${BASE_URL}/by-ids`, {
        ids,
        userId: user.UUId,
      });

      return res.data.map((chat: any) => ({
        ...chat,
        users: chat.users.filter((u: any) => u !== user.UUId),
      }));
    },
    enabled: !!user?.chats?.length,
  });

  // 📌 Архивация чата
  const archiveChat = useMutation({
	mutationFn: async (chatId: string) => {
	  if (!user) return;
	  await axios.post(`${BASE_URL}/addChatOnArchive/${chatId}`, {
		 userId: user.UUId,
	  });
	},
	onSuccess: (_res, chatId) => {
	  updateUserChats(chatId, { isArchived: true });
	  queryClient.invalidateQueries({ queryKey: ['chats'] }); // по желанию
	},
 });

 const pinChat = useMutation({
	mutationFn: async (chatId: string) => {
	  if (!user) return;
	  await axios.post(`${BASE_URL}/pinChat/${chatId}`, { userId: user.UUId });
	},
	onSuccess: (_res, chatId) => {
	  updatePinnedChatId(chatId, true);
	}
 });

 const deleteChat = useMutation({
	mutationFn: async (chatId: string) => {
	  await axios.delete(`${BASE_URL}/${chatId}`);
	},
	onSuccess: (_res, chatId) => {
	  // Удаляем чат из локального состояния пользователя
	  if (user) {
		 const newChats = user.chats.filter(c => c.chatId !== chatId);
		 updateUserChats(chatId, null); // Или можешь передать newChats, если у тебя функция принимает весь массив
	  }
 
	  // Инвалидируем кэш
	  queryClient.invalidateQueries({ queryKey: ['chats'] });
	},
	onSettled: () => {
	  console.log('Удаление завершено');
	},
	onError: (err) => {
	  console.error('Ошибка при удалении чата', err);
	}
 });
 
 
 const unpinChat = useMutation({
	mutationFn: async (chatId: string) => {
	  if (!user) return;
	  await axios.post(`${BASE_URL}/unpinChat/${chatId}`, { userId: user.UUId });
	},
	onSuccess: (_res, chatId) => {
	  updatePinnedChatId(chatId, false);
	}
 });
 

  // 📌 Разархивация чата
  const unarchiveChat = useMutation({
	mutationFn: async (chatId: string) => {
	  if (!user) return;
	  await axios.post(`${BASE_URL}/removeChatOnArchive/${chatId}`, {
		 userId: user.UUId,
	  });
	},
	onSuccess: (_res, chatId) => {
	  updateUserChats(chatId, { isArchived: false });
	  queryClient.invalidateQueries({ queryKey: ['chats'] }); // по желанию
	},
 });
 

  return {
    chats,
	 deleteChat: deleteChat.mutateAsync,
	 unpinChat: unpinChat.mutateAsync,
	 pinChat: pinChat.mutateAsync,
    isLoading: isUserLoading || isLoading,
    error: userError || error,
    archiveChat: archiveChat.mutateAsync,
    unarchiveChat:unarchiveChat.mutateAsync,
  };
};
