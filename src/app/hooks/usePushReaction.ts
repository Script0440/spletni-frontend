import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from './useUser';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/messages`;

export const usePushReaction = (chatId: string | number) => {
  const queryClient = useQueryClient();
	const {user} = useUser()


	// переделать реакции

  const pushReactionMutation = useMutation({
    mutationFn: async ({
      messageUId,
      userId,
      emoji,
    }: {
      messageUId: string;
      userId: string;
      emoji: string;
    }) => {
      const res = await axios.post(
        `${BASE_URL}/reactions`,
        {
          chatId,
          messageUId,
          userId,
          emoji,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('📦 Sent data:', { chatId, messageUId, userId, emoji });

      return res.data;
    },
    onSuccess: (data, variables) => {
      const { messageUId, userId, emoji } = variables;

      // Обновляем кэш сообщений для чата
		queryClient.setQueryData(['messages', chatId], (oldData: any) => {
			console.log('🔥 Updating cache', oldData);
		 
			if (!oldData?.pages) return oldData;
		 
			const newData = {
			  ...oldData,
			  pages: oldData.pages.map((page: any[]) =>
				 page.map((m) => {
					if (m.messageUId !== messageUId) return m;
		 
					const currentReactions = m.reactions || [];
		 
					const hasReaction = currentReactions.some(
						(r) => r.emoji === emoji && r.userId === user.UUId
					 );
					 
					 const updatedReactions = hasReaction
						? currentReactions.filter(
							 (r) => !(r.emoji === emoji && r.userId === user.UUId)
						  )
						: [...currentReactions, { userId: user.UUId, emoji }];
					 
		 
					return { ...m, reactions: updatedReactions };
				 })
			  ),
			};
		 
			console.log('✅ Updated cache:', newData);
			return newData;
		 });
		 
		 
		 
    },
  });

  return {
    pushReaction: pushReactionMutation.mutateAsync,
    isPushing: pushReactionMutation.isLoading,
    reactionError: pushReactionMutation.error,
    reactionSuccess: pushReactionMutation.data?.message,
  };
};
