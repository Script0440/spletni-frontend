'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Avatar from '@/app/components/Avatar';
import Input from '@/app/components/Input';
import Message from '@/app/components/Message';
import ChatInput from '@/app/components/ChatInput';
import ButtonHover from '@/app/components/ButtonHover';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/hooks/useTheme';
import { useMessages } from '@/app/hooks/useMessages';
import { useUser } from '@/app/hooks/useUser';
import { useChat } from '@/app/hooks/useChat';
import { useDeleteChat } from '@/app/hooks/useDeleteChat';
import { usePinMessage } from '@/app/hooks/usePinMessage';
import { useMessageById } from '@/app/hooks/useMessageById';
import { useSocket } from '@/app/hooks/useSocket';
import TypingIndicator from '@/app/components/TypingIndicator';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Modal } from '@/app/components/Modal';
import CallModel from '@/app/components/CallModel';
import formatTime from '../../../../func/formatTime';
import { IoSearch, IoCallOutline, IoVideocamOutline, IoArchiveOutline, IoClose } from 'react-icons/io5';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useChatSocket } from '@/app/hooks/useChatSocket';
import { useCallback } from 'react';
import LoadingMore from '@/app/components/LoadingMore';
import UsersList from '@/app/components/UsersList';

import Button from '@/app/components/Button';
import Search from '@/app/components/Search';
import Menu from '@/app/components/Menu';
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import ChatSettings from '@/app/components/ChatSettings';
import ConfirmDeleteChat from '@/app/components/ConfirmDeleteChat';



const Chat = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position:relative;
`

const Messages = styled.ul`

  position: relative;
  list-style-type: none;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 10px;
  gap: 10px;
;
`


const Title = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color};
  display: flex;
  justify-content:space-between;
  align-items: center;
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  height: max-content;
  padding: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(15px); /* Для Safari */
  z-index: 5; /* Ensure it stays above Messages */
;
`

const Online = styled.div`
	display:flex;
	align-items:center;
	gap:10px;
	div{
		width:10px;
		height:10px;
		background: ${({theme})=> theme.accentColor};
		box-shadow: 0px 0px 5px ${({theme})=> theme.accentColor};
		border-radius:100%;
	}
`

const LoadingMessages = styled.section`
padding:20px;
position:sticky;
bottom:50%;
display:flex;
background:transparent;
flex-direction:row;
justify-content:center;
z-index:90;
	width:100%;
`

const PinMessage = styled.div`
	width:100%;
	cursor: pointer;
	div{
		position:relative;
		button{
			position:absolute;
			right:0px;
			top:0px;
			font-size:28px;
		}
		border-left:1px solid ${({theme})=> theme.accentColor};
		padding:10px;
		display:flex;
		flex-direction:column;
		gap:5px;
		h4{
			color:${({theme})=> theme.accentColor}
		}
		h5{
		font-weight:500;
		font-size:18px;
	}
		span{
		position:absolute;
		right:0px;
		bottom:0px;
		color:gray;
	}
	}
`

const MenuContainer = styled.div`
	width:300px !important;
	display:flex;

	z-index:50;
	align-items:flex-end;
	justify-content:flex-end;
	position:relative;
	`

const InfoMessage = styled.div`
margin: 0 auto;
gap:20px;
display:flex;
flex-direction:column;
align-items:center;
margin-top:10px;
background: ${({theme})=> theme.opacityAccentCOlor};
padding:10px;
border-radius:15px;
`

const UsersListButton = styled.button`
background:transparent;
cursor: pointer;
padding:0px;
border:none;
color:${({theme})=> theme.color};
transition:0.3s all;
&:hover{
	color:${({theme})=> theme.accentColor};
}
h5{
	font-size:16px;
	font-weight:500;
}
`

const ProfileMenu = styled.div`
	display:flex;
	flex-direction:column;
	width:max-content;
	padding:5px;
	gap:10px;
	font-size:16px;
	button{
		gap:10px;
		display:flex;
		align-items:center;
		justify-content:flex-start;
		align-self:flex-start;
	}
`

const ChatWallpaper = styled.img`
	position:absolute;
	z-index:-1;
	width:100%;
	object-fit:cover;
	height:100%;
`

function groupMessagesByDate(messages: any[]) {
	const today = new Date();
	const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
 
	return messages.reduce((acc, message) => {
	  const msgDate = new Date(message.timestamp);
	  const msgStartOfDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
 
	  const diffTime = todayStart.getTime() - msgStartOfDay.getTime();
	  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
 
	  let dateKey = '';
	  if (diffDays === 0) dateKey = 'Сегодня';
	  else if (diffDays === 1) dateKey = 'Вчера';
	  else if (diffDays === 2) dateKey = 'Позавчера';
	  else {
		 const now = new Date();
		 const isSameYear = msgDate.getFullYear() === now.getFullYear();
		 dateKey = msgDate.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: 'long',
			...(isSameYear ? {} : { year: 'numeric' }),
		 });
	  }
 
	  acc[dateKey] = acc[dateKey] || [];
	  acc[dateKey].push(message);
	  return acc;
	}, {} as Record<string, any[]>);
 }
 
 const ChatPage = () => {
	const params = useParams();
	const router = useRouter();
	const { themeObject } = useTheme();
	const { emit, on, off } = useSocket();
	const { messages, isLoading,
		deleteMessage,
		fetchNextPage,
		hasNextPage,
		readMessages,
		readAllMessages,
		isFetchingNextPage
	  } = useMessages(params.uId);
	const { addUser,updateAvatar, updateName, updateRules, kickUser, isAddingUser, isKickingUser,data: chat, isLoading: isChatLoading } = useChat(params.uId);
	const { user: currentUser, isLoading: isCurUserLoading } = useUser();
	const { data: pinMessageData, isLoading: isPinLoading } = useMessageById(params.uId, chat?.pinIdMessage);
	const { pinMessage, unpinMessage } = usePinMessage(params.uId);
	const { deleteChat } = useDeleteChat();
	const [userTyping, setUserTyping] = useState(false);
	const [isDeletingChat,setIsDeletingChat] = useState(false);
	const [isRead, setIsRead] = useState(null);
	const [isReply, setIsReply] = useState(null);
	const [openCallModel, setOpenCallModel] = useState(false);
	const groupedMessages = groupMessagesByDate(messages);
	const messagesRef = useRef(null);
	const messagePinRef = useRef(null);
	const messagesEndRef = useRef(null);
	const [privateChat,setPrivateChat] = useState(true);
	const hasCalculatedNoRead = useRef(false);
	const [openMenu,setOpenMenu] = useState(false);
	const [openSettings,setOpenSettings] = useState(false)
	useChatSocket({
	  chatId: params.uId,
	  userId: currentUser?.UUId,
	  emit,
	  on,
	  off,
	  setUserTyping,
	});
 
	const handleDelete = async () => {
	  await deleteChat(params.uId);
	  router.push('/messages');
	};
	
	 
	 useEffect(() => {
		if (messages.length > 0 && !hasCalculatedNoRead.current && currentUser) {
			emit('readAllMessages',{chatId:params.uId,userId:currentUser.UUId})
			readAllMessages(currentUser?.UUId)
		  hasCalculatedNoRead.current = true; // чтобы не вызывалось снова
		}
		console.log(messages)
	 }, [messages]);
 
	const scrollToMessage = () => {
	  const el = messagePinRef.current;
	  if (el && messagesRef.current) {
		 el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	  }
	};

	const isFetchingNextPageRef = useRef(isFetchingNextPage);
	const hasNextPageRef = useRef(hasNextPage);
	
	// Обновляем рефы при изменении состояния
	useEffect(() => {
	  isFetchingNextPageRef.current = isFetchingNextPage;
	  hasNextPageRef.current = hasNextPage;
	}, [isFetchingNextPage, hasNextPage]);
	
	// Обработчик скролла, без зависимости от isFetchingNextPage и hasNextPage
	const handleScroll = useCallback(() => {
		const container = messagesRef.current;
		if (!container || isFetchingNextPageRef.current || !hasNextPageRef.current) return;
	 
		const { scrollTop, scrollHeight, clientHeight } = container;
		
		// Верх — близко к -(scrollHeight - clientHeight)
		const topThreshold = -(scrollHeight - clientHeight);
		
	 
		// Если пользователь доскроллил до верхнего края, например, с запасом 10px
		if (scrollTop <= topThreshold + 120) {
		  const prevScrollHeight = scrollHeight;
	 
		  fetchNextPage().then(() => {
			 const newScrollHeight = container.scrollHeight;
			 container.scrollTop = newScrollHeight - prevScrollHeight + scrollTop;
		  });
		}
	 }, [fetchNextPage]);
	 
	
	 useEffect(() => {
		const checkAndAttach = () => {
		  const container = messagesRef.current;
		  if (!container) {
			 requestAnimationFrame(checkAndAttach);
			 return;
		  }
		  container.addEventListener('scroll', handleScroll);
		  console.log('scroll event listener added');
	 
		  // Отписка
		  return () => {
			 container.removeEventListener('scroll', handleScroll);
			 console.log('scroll event listener removed');
		  };
		};
	 
		const cleanup = checkAndAttach();
	 
		// Если cleanup вернул функцию — нужно её вызвать в return
		return () => {
		  if (typeof cleanup === 'function') cleanup();
		};
	 }, [handleScroll]);
	 
	 
 
	 const handleReply = useCallback((msg) => setIsReply(msg), []);
	 const handleRead = useCallback((msg) => setIsRead(msg), []);
	 const handlePin = useCallback((msgId) => pinMessage(msgId), [pinMessage]);
	 const handleUnpin = useCallback(() => unpinMessage(), [unpinMessage]);
	 const handleDeletMessage = useCallback((msgId) => deleteMessage(msgId), [deleteMessage]);
	 const emitSocket = useCallback((...args) => emit(...args), [emit]);
	 const onSocket = useCallback((...args) => on(...args), [on]);
	 const offSocket = useCallback((...args) => off(...args), [off]);
	 
	if (
	  !themeObject ||
	  isLoading ||
	  isChatLoading ||
	  isCurUserLoading ||
	  isPinLoading
	) return <LoadingSpinner />;
 
	return (
	  <Chat>

		 <Title theme={themeObject}>
			<div style={{display:'flex',gap:"10px",flexDirection:'column',width:"100%"}}>
				<div  style={{display:'flex',justifyContent:'space-between'}}>
				<div onClick={()=> setOpenSettings(true)} style={{ display: 'flex', flexDirection:'row', cursor:"pointer", gap: '10px', alignItems: 'center' }}>
					<Avatar onClick={(e)=>{
						setOpenSettings(true)
						e.stopPropagation()}} url={chat.avatar} />
					<div>
						<h3>{chat.name}</h3>
						{
							chat.type === 'private' ? <Online theme={themeObject}>
							{userTyping ? <TypingIndicator /> : (<><div /> <h4>В сети</h4></>)}
						</Online> : <UsersListButton theme={themeObject}>
						<h5>Участники: <span>
						{chat.users.length}
							</span></h5>
							</UsersListButton>
						}

					</div>
						</div>
					<MenuContainer theme={themeObject}>
			  {openCallModel && (
				 <Modal isOpen onClose={() => setOpenCallModel(false)}>
					<CallModel />
				 </Modal>
			  )}
			  {isDeletingChat && (
				 <Modal styled={{height:'max-content'}} isOpen={isDeletingChat} onClose={() => setIsDeletingChat(false)}>
					<ConfirmDeleteChat chat={chat} onClose={() => setIsDeletingChat(false)} handleConfirm={handleDelete} />
				 </Modal>
			  )}
			  {openSettings && <Modal isOpen={openSettings} onClose={()=> setOpenSettings(false)}>
					<ChatSettings updateAvatar={updateAvatar} updateName={updateName} kickUser={kickUser} addUser={addUser} isAddingUser={isAddingUser}isKickingUser={isKickingUser} updateRules={updateRules} chat={chat}/>
				</Modal>
			  }
			  <ButtonHover isActive={openMenu} onClick={()=>  setOpenMenu(!openMenu)}>
				  <FaEllipsisVertical size={24}/>
			  </ButtonHover>
			  {
				openMenu && <Menu offsetX='-30px' offsetY='30px' onClose={()=> setOpenMenu(false)}>
				<ProfileMenu>
					<ButtonHover><IoSearch /> Поиск</ButtonHover>
					<ButtonHover onClick={()=> {
						setOpenMenu(false)
						setOpenSettings(true)
						}}><IoSettingsOutline/> Настройки</ButtonHover>
					<ButtonHover onClick={() => setOpenCallModel(true)}><IoCallOutline />Позвонить</ButtonHover>
					<ButtonHover><IoVideocamOutline /> Видеозвонок</ButtonHover>
					<ButtonHover><IoArchiveOutline /> Архивировать</ButtonHover>
					<ButtonHover onClick={()=> setIsDeletingChat(true)}><FaRegTrashCan /> Удалить</ButtonHover>
				</ProfileMenu>
				</Menu>
			  }

			</MenuContainer>
				</div>
				{pinMessageData && <PinMessage onClick={scrollToMessage} theme={themeObject}>
				 <div>
					<h4>Закреплённое сообщение</h4>
					<section style={{display:'flex',alignItems:"center",gap:"10px"}}>
					{
						pinMessageData.images.slice(0,3).map((m)=> <img style={{objectFit:'cover'}} width={50} height={50} src={`http://localhost:3001/${m.imageUrl}`}/>)
					}
					<h5>{pinMessageData.content.length > 50 ? pinMessageData.content.slice(0,50) + "..." : pinMessageData.content}</h5>
					</section>
					<ButtonHover onClick={(e)=> {
						e.stopPropagation()
						unpinMessage()}}><IoClose /></ButtonHover>
					<span>{formatTime(pinMessageData.timestamp)}</span>
				 </div>
			  </PinMessage>}
			</div>
		 </Title>
		 <ChatWallpaper src="https://resizer.mail.ru/p/d79c6828-4276-5130-ae07-197ccff3d986/AQAKVsilDJ1v97EmCKZ8qqXpluldIDOaP5_txHtCKMfuUBlI8-t37jOn4hNB5iIAc68mfqgLV-a25jRCAfV9QGiTVJ8.png"/>
		 <Messages ref={messagesRef}>
		 <InfoMessage theme={themeObject}>Арман изменил название чата</InfoMessage>
		 <InfoMessage theme={themeObject}>Арман обновил аватар чата
		 <Avatar size={100} onClick={(e)=>{
						setOpenSettings(true)
						e.stopPropagation()}} url={chat.avatar} />
		 </InfoMessage>
		 <InfoMessage theme={themeObject}>Арман изменил правила чата
		 </InfoMessage>
		 <InfoMessage theme={themeObject}>Арман исключил пользователя: Джон</InfoMessage>
		 {
						isFetchingNextPage && <LoadingMessages>
						<LoadingMore theme={themeObject}/>
					</LoadingMessages>

					}
			<div ref={messagesEndRef} />
			{Object.entries(groupedMessages).map(([date, msgs]) =>  (
			  <React.Fragment key={date}>
				 {msgs.map((m) => (
					<Message
					isPrivate={privateChat}
					deleteMessage={handleDeletMessage}
					  key={m.messageUId}
					  ref={m.messageUId === pinMessageData?.messageUId ? messagePinRef : null}
					  emit={emitSocket}
					  on={onSocket}
					  off={offSocket}
					  onReply={handleReply}
					  onRead={handleRead}
					  onPin={handlePin}
					  unPin={handleUnpin}
					  pinId={pinMessageData?.messageUId}
					  chatId={chat.uId}
					  message={{
						 ...m,
						 data: m.timestamp
					  }}
					  theme={themeObject}
					/>
				 ))}
				 <InfoMessage theme={themeObject}>{date}</InfoMessage>
			  </React.Fragment>
			))}
		 </Messages>
		 <ChatInput
			emit={emit}
			chatId={params.uId}
			theme={themeObject}
			replyMessage={isReply}
			readMessage={isRead}
			clearReplyMessage={() => setIsReply(null)}
			clearReadMessage={() => setIsRead(null)}
		 />
	  </Chat>
	);
 };
 
 export default ChatPage;
 