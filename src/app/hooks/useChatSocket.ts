import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useUser } from './useUser';

export function useChatSocket({
  chatId,
  emit,
  on,
  userId,
  off,
  setUserTyping,
}: {
  chatId: string;
  userId: string;
  emit: any;
  on: any;
  off: any;
  setUserTyping: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const queryKey = ['messages', chatId];
  const { uId } = useParams<{ uId: string }>();
  const {user} = useUser();

  useEffect(() => {
    emit('join', chatId);

	 const handleNewMessage = (msg: any) => {
		queryClient.setQueryData(queryKey, (oldData: any) => {
		  if (!oldData) return oldData;
			console.log('Пришло новое сообщение.')
		  const firstPage = oldData.pages[0];
	 
		  // Проверка: есть ли уже это сообщение
		  const exists = firstPage.some((m) => m.messageUId === msg.messageUId);
		  if (exists) return oldData;
		  if(uId === chatId){
			if(user){
				console.log('Я есть')
				emit('readMessage',{chatId:msg.chatId,userId:user.UUId,messageId:msg.messageUId})
			}
			return {
				...oldData,
				pages: [
				  [{ ...msg, isRead: [...(msg.isRead ?? []), userId] }, ...firstPage],
				  ...oldData.pages.slice(1),
				],
			 };
		  }else{
			  return {
				 ...oldData,
				 pages: [
					[msg, ...firstPage],
					...oldData.pages.slice(1),
				 ],
			  };
		  }
		});
	 };
	 

    const handleTyping = () => setUserTyping(true);
    const handleStopTyping = () => setUserTyping(false);

    const handleDeleteMessage = (data: any) => {
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.filter((m) => m.messageUId !== data.messageUId)
          ),
        };
      });
    };

    const handleEditMessage = (data: any) => {
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any[]) =>
            page.map((m) =>
              m.messageUId === data.messageUId
                ? { ...m, content: data.content, isEdit: true }
                : m
            )
          ),
        };
      });
    };

    const handleReaction = (msg: any) => {
		
		const newReaction = { emoji: msg.reaction, userId: msg.userId };
	 
		console.log(msg);
		
		queryClient.setQueryData(queryKey, (oldData: any) => {
		  if (!oldData?.pages) return oldData;
	 
		  const newData = {
			 ...oldData,
			 pages: oldData.pages.map((page: any[]) =>
				page.map((m) => {
				  if (m.messageUId !== msg.messageUId) return m;
	 
				  const currentReactions = m.reactions || [];
	 
				  const hasReaction = currentReactions.some(
					 (r) => r.emoji === newReaction.emoji && r.userId === msg.userId
				  );
	 
				  const updatedReactions = hasReaction
					 ? currentReactions.filter(
						  (r) => !(r.emoji === newReaction.emoji && r.userId === msg.userId)
						)
					 : [...currentReactions, newReaction];
	 
				  return { ...m, reactions: updatedReactions };
				})
			 ),
		  };
	 
		  console.log('✅ Updated cache:', newData);
		  return newData;
		});
	 };
	 

    on('messageToRoom', handleNewMessage);
    on('typing', handleTyping);
    on('stopTyping', handleStopTyping);
    on('deleteMessage', handleDeleteMessage);
    on('editMessage', handleEditMessage);
    on('reactionToRoomMessage', handleReaction);

    return () => {
      off('messageToRoom', handleNewMessage);
      off('typing', handleTyping);
      off('stopTyping', handleStopTyping);
      off('deleteMessage', handleDeleteMessage);
      off('editMessage', handleEditMessage);
      off('reactionToRoomMessage', handleReaction);
    };
  }, [chatId, emit, on, off, setUserTyping, queryClient,user && user.UUId]);
}
