// hooks/useCreateChat.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateChat = () => {
	const queryClient = useQueryClient();
 
	const mutation = useMutation({
	  mutationFn: async (payload: { userIdOne: string; userIdTwo: string }) => {
		 const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, payload);
		 return res.data;
	  },
	  onSuccess: () => {
		 queryClient.invalidateQueries(['chats']);
	  },
	});
 
	return {
	  createChat: mutation.mutateAsync,
	  isCreating: mutation.isLoading,
	  error: mutation.error,
	};
 };
 