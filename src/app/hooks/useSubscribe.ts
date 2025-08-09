import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3001'; // твой адрес API

export const useSubscribe = () => {
  const queryClient = useQueryClient();

  const subscribe = useMutation({
    mutationFn: ({ currentUserId, targetUserId }: { currentUserId: string; targetUserId: string }) =>
      axios.post(`${API_URL}/user/${currentUserId}/subscribe/${targetUserId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const unsubscribe = useMutation({
    mutationFn: ({ currentUserId, targetUserId }: { currentUserId: string; targetUserId: string }) =>
      axios.delete(`${API_URL}/user/${currentUserId}/unsubscribe/${targetUserId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { subscribe, unsubscribe };
};
