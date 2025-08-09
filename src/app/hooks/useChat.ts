import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from './useUser';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/chat`;

export const useChat = (chatId: string) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const chatQuery = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post(`${BASE_URL}/getOne/${chatId}`, {
        userId: user.UUId,
      });
      return res.data;
    },
    enabled: !!chatId,
  });

  const addUserMutation = useMutation({
    mutationFn: async (addingUserId: string) => {
      const res = await axios.post(`${BASE_URL}/addUser/${chatId}`, {
        addingUserId,
        currentUserId: user.UUId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', chatId]);
    },
  });

  const updateRulesMutation = useMutation({
	mutationFn:async(newRules) => {
		const res = await axios.patch(`${BASE_URL}/updateRules/${chatId}`,{
			newRules
		})
      return res.data;
	},
	onSuccess: () => {
      queryClient.invalidateQueries(['chat', chatId]);
    },
  })


  const updateAvatarMutation = useMutation({
	mutationFn: async (newAvatar: File) => {
	  const formData = new FormData();
	  formData.append('file', newAvatar);
 
	  const res = await axios.patch(`${BASE_URL}/updateAvatar/${chatId}`, formData, {
		 headers: { 'Content-Type': 'multipart/form-data' },
	  });
 
	  return res.data;
	},
	onSuccess: () => {
	  queryClient.invalidateQueries(['chat', chatId]);
	},
 });

  const updateNameMutation = useMutation({
	mutationFn: async (newName: string) => {
	  const res = await axios.patch(`${BASE_URL}/updateName/${chatId}`, {
		 newName,
	  });
	  return res.data;
	},
	onSuccess: () => {
	  queryClient.invalidateQueries(['chat', chatId]);
	},
 });
 

  const kickUserMutation = useMutation({
    mutationFn: async (kickedUserId: string) => {
      const res = await axios.post(`${BASE_URL}/kickUser/${chatId}`, {
        kickedUserId,
        currentUserId: user.UUId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', chatId]);
    },
  });

  return {
    ...chatQuery,
    addUser: addUserMutation.mutateAsync,
	 updateRules: updateRulesMutation.mutateAsync,
	 updateAvatar: updateAvatarMutation.mutateAsync,
	 updateName: updateNameMutation.mutateAsync,
    kickUser: kickUserMutation.mutateAsync,
    isAddingUser: addUserMutation.isPending,
    isKickingUser: kickUserMutation.isPending,
  };
};
