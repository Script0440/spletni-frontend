import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (chatId: string) => {
      const res = await axios.delete(`http://localhost:3001/chat/${chatId}`);
      return res.data; // возвращаем удалённый чат (или просто статус)
    },
    onSuccess: () => {
      // обновим список чатов после удаления
      queryClient.invalidateQueries(['chats']);
    },
  });

  return {
    deleteChat: mutation.mutateAsync,
    isDeleting: mutation.isLoading,
    error: mutation.error,
  };
};