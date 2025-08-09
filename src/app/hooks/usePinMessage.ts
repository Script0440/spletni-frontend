import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const usePinMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  // Закрепить сообщение
  const pinMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/pin/${chatId}`, {
        messageId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', chatId]);
    },
  });

  // Открепить сообщение
  const unpinMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/pin/${chatId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', chatId]);
    },
  });

  return {
    pinMessage: pinMutation.mutateAsync,
    isPinning: pinMutation.isLoading,
    unpinMessage: unpinMutation.mutateAsync,
    isUnpinning: unpinMutation.isLoading,
    pinError: pinMutation.error,
    unpinError: unpinMutation.error,
  };
};
