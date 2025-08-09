import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUsers = (search?: string) => {
  return useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3001/user/getUsers`, {
        params: { query: search },
      });
      return data.users;
    },
    enabled: !!search,
  });
};
