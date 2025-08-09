import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/messages`;

export const useMessageById = (chatId: string, messageId: string) => {
  const queryClient = useQueryClient();

  // Получение сообщения
  const messageQuery = useQuery({
    queryKey: ['message', chatId, messageId],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/${chatId}/${messageId}`);
      return res.data;
    },
    enabled: !!chatId && !!messageId,
  });

  // Удаление сообщения
  const deleteMessageMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`${BASE_URL}/${chatId}/${messageId}`);
      return res.data;
    },
  });

  return {
    ...messageQuery,
    deleteMessage: deleteMessageMutation.mutateAsync,
    isDeleting: deleteMessageMutation.isLoading,
    deleteError: deleteMessageMutation.error,
  };
};
