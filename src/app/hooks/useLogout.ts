import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { useRouter } from 'next/navigation';


export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
      if (!res.data) {
        throw new Error('Не удалось выйти из системы');
      }
      return res.data;
    },

	onSuccess: () => {
		router.push('/auth/login')
	queryClient.setQueryData(['user', 'me'], () => ({ user: null }));
	}

  });

  return {
    logout: mutation.mutateAsync,
    isLoggingOut: mutation.isLoading,
    logoutError: mutation.error,
  };
};
