import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useManyUsers = (usersIds: string[]) => {
  const stableIds = [...usersIds].sort(); // сортировка для стабильности ключа
  const queryKey = ['users', stableIds.join(',')]; // сериализация ключа

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!stableIds || stableIds.length === 0) {
        return [];
      }

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/getManyUsersByIds`, {
        userIds: stableIds,
      });

      console.log(data);
      return data;
    },
    enabled: stableIds.length > 0,
    staleTime: 5 * 60 * 1000, // 🕒 опционально: кэш считается "свежим" 5 минут
    cacheTime: 30 * 60 * 1000, // 🧠 опционально: держим кэш 30 минут
  });
};
