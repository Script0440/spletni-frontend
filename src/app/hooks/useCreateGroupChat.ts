import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type CreateGroupChatPayload = {
  name: string;
  users: string[];
  ownerId: string;
  avatar?: File | null;
};

export function useCreateGroupChat() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ name, users, ownerId, avatar }: CreateGroupChatPayload) => {
      console.log(name, users, ownerId, avatar);
      const formData = new FormData();

      formData.append('name', name);
      formData.append('ownerId', ownerId);
      formData.append('users', JSON.stringify(users));

      if (avatar) {
        formData.append('files', avatar);
      }

      const response = await axios.post('http://localhost:3001/chat/create-group', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },

    // 👇 Инвалидация данных после успешного запроса
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['chats']); // Инвалидация кеша чатов

      // Если передали внешний onSuccess — вызываем
      if (context?.onSuccess) {
        context.onSuccess(data);
      }
    },
  });

  const createGroupChat = (
    data: CreateGroupChatPayload,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        if (options?.onSuccess) options.onSuccess(data);
      },
      onError: (error) => {
        if (options?.onError) options.onError(error);
      },
    });
  };

  return {
    createGroupChat,
    ...mutation,
  };
}
