"use client"
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import ButtonHover from './ButtonHover';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from './LoadingSpinner';
import EmojiPicker from './EmojiPicker';
import EmojiMessage from './EmojiMessage';
import { usePushReaction } from '../hooks/usePushReaction';
import data from '@emoji-mart/data';
import formatTime from '../../../func/formatTime';
import { useMessageById } from '../hooks/useMessageById';
import ImageGallery from './ImageGallery';

import { IoArrowUndoSharp, IoTrashBin, IoArrowRedo } from "react-icons/io5";
import { MdEmojiEmotions, MdEdit } from "react-icons/md";
import { FaCopy, FaStar } from "react-icons/fa";
import { TiPin } from "react-icons/ti";
import { RiUnpinFill } from "react-icons/ri";
import parse from 'html-react-parser';
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";
import VideoGallery from './VideoGallery';
import UserAvatar from './UserAvatar';



const StyledMessage = styled.li`
	display:flex;
	align-items:center;
	flex-direction:column;
	position:relative;
	gap:10px;
	${(props) => props.isPick && `
		background:${props.theme.hoverBgGray};
	`}

	p{
		font-size:18px;
		color: ${({theme})=> theme.color}
	}
	margin:10px;
	padding:10px;
	padding-right:0px;
	border-bottom:1px solid transparent;

	&:hover{
		border-bottom:1px solid ${({theme})=> theme.color};
		${(props)=> !props.isPick && `
					section{
			display:flex;
	}
		`}

		span{
			color: ${({theme})=> theme.color}
		}
	}
`

const Menu = styled.section`
	border: 1px solid ${({theme})=> theme.color};
	background: ${({theme})=> theme.backgroundDark};
	z-index:50;
	display: ${({isActive})=> isActive ? "flex" : "none"};
	position:absolute;
	gap:5px;
	right:5px;
	top:-5px;
	font-size:20px;
	width:max-content;
	padding:10px;
	height:50px;
	border-radius:10px;
`
const Content = styled.div`
width:100%;
p{
	max-width:700px;
	word-wrap: break-word;
}
align-items:flex-end;
display:flex;
gap:10px;
`

const Reactions = styled.div`
width:100%;
gap:10px;
button:hover{
	cursor: pointer;
	transform:scale(1.25)
}
display:flex;
font-size:16px;
`

const ReplyStyled = styled(Content)`
padding:5px;
margin:0px;
border-radius:10px;
background: ${({theme})=> theme.opacityAccentCOlor};
`

const MessageInfo = styled.div`
	font-size:16px;
	display:flex;
	align-items:center;
	gap:10px;
	position:absolute;
	right:15px;
	bottom:0px;
	svg{
		font-size:20px;
	}
	span{
		color:gray;
	}
`


const ContentMessage = styled.div`
position:relative;
	background:${({theme})=> theme.background};
	border-radius:10px 10px 10px 0px;
	padding:10px;
display:flex;
flex-direction:column;
svg{
	fill: ${({theme})=> theme.background};
}
gap:10px;
a{
	color:${({theme})=> theme.accentColor};
	text-decoration: none;
}
`

const UpdateIndicator = styled.span`
	top:0;
	z-index:-1;
`

const MessageDecore = styled.svg`
	position: absolute;
	width:25px;
	height:20px;
	left:-13px;
	bottom:0;
	z-index:-1;
`


// Вынесенная функция для получения эмодзи по id
const getEmojiChar = (id: string): string => {
	const emoji = data.emojis[id];
	if (!emoji) return '❓';
	const unified = emoji.skins?.[0]?.unified || emoji.unified;
	return String.fromCodePoint(...unified.split('-').map(u => parseInt(u, 16)));
 }
 
 const ReplyMessage = memo(({ theme, messageId, chatId, images }: { theme: any; messageId: string; chatId: string; images?: any[] }) => {
	const { data } = useMessageById(chatId, messageId);
	const { user } = useUser(data?.uuid);
 
	if (!data) return null;
 
	return (
	  <ReplyStyled theme={theme}>
		 <Avatar url={user?.avatar} size='50px' />
		 <div>
			{images && images.length > 0 && <ImageGallery images={images} />}
			<p>{data?.content.length > 300 ? data?.content.slice(0, 297) + '...' : data?.content}</p>
		 </div>
	  </ReplyStyled>
	);
 });
  
 // === Основной компонент Message ===
 interface MessageProps {
	emit: Function;
	on:Function;
	off:Function;
	deleteMessage: Function;
	ref?: React.Ref<HTMLDivElement>;
	onReply: (message: any) => void;
	onRead: (message: any) => void;
	pinId: string | null;
	unPin: (id: string) => void;
	onPin: (id: string) => void;
	theme: any;
	message: any;
	chatId: string;
 }
 
 const MessageComponent = ({isPrivate,on,off, emit, deleteMessage, ref, onReply, onRead, pinId, unPin, onPin, theme, message, chatId }: MessageProps) => {
	const [isPick, setIsPick] = useState(false);
	const { user, isLoading } = useUser(message.uuid);
	const { user: currentUser } = useUser();
	const [isOpenEmoji, setIsOpenEmoji] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);
	const { pushReaction } = usePushReaction(chatId);
	const [isRead, setIsRead] = useState(
		(
		  message?.isRead.includes(currentUser?.UUId)
			 ? message?.isRead
			 : [...message?.isRead, currentUser?.UUId]
		).length > 1
	 );
	 

	console.log('Render message', message.messageUId);
	

useEffect(() => {
	function handleMessageRead(data: { messageId: string; userId: string }) {
	  if (data.messageId === message.messageUId) {
		 console.log('🔥 Прочитано сообщение2', data);
		 setIsRead(true)
	  }
	}
	function handleMessageReadAll(){
		console.log('🔥 Прочитал все сообщения');
		setIsRead(true)
	}
 
	// При спаме пробелы на прочтение сообщения
	// console.log('453')

	// подписываемся
	on('readsMessage', handleMessageRead);
	on('readsAllMessages', handleMessageReadAll);
 
	// отписываемся тем же reference
	return () => {
	  off('readsMessage', handleMessageRead);
	  off('readsAllMessages', handleMessageReadAll);
	};
 }, [on,off,emit]);
 

	//отслеживать прочтение сообщения тут и менять isRead
	const handleDelete = useCallback(() => {
	  emit('deleteMessage', { chatId, messageUId: message.messageUId });
	  deleteMessage({ messageId: message.messageUId });
	}, [emit, deleteMessage, chatId, message.messageUId]);
 
	const handleSelectEmoji = useCallback(async (emoji: string) => {
	  if (!message?.messageUId || !user?.UUId || !chatId) return;
	  try {
		 await pushReaction({ messageUId: message.messageUId, userId: user.UUId, emoji });
		 emit('pushReactionOnMessage', { chatId, uuid: currentUser.UUId, messageUId: message.messageUId, reaction: emoji,avatar:user.avatar });
	  } catch (error) {
		 console.error(error);
	  }
	}, [pushReaction, emit, message.messageUId, user?.UUId, chatId]);
 
	useEffect(() => {
	  const handleClickOutside = (event: MouseEvent) => {
		 if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
			setIsOpenEmoji(false);
		 }
	  };
	  document.addEventListener('mousedown', handleClickOutside);
	  return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
 
	if (isLoading) return <LoadingSpinner />;
 
	function linkifyContent(content: string) {
		// Поддерживаемые доменные зоны (расширяем при необходимости)
		const tlds = ['com', 'ru', 'org', 'net', 'am', 'dev', 'io', 'ai'];
		const tldPattern = tlds.join('|');
	 
		// Регулярка:
		// - ищет ссылки с или без протокола
		// - гарантирует, что после TLD нет лишних букв (используем негативный просмотр)
		const urlRegex = new RegExp(
		  `\\b((?:https?:\\/\\/)?(?:www\\.)?[\\w-]+(?:\\.[\\w-]+)*\\.(${tldPattern}))(?!\\w)([\\/\\w\\d\\-._~:?#[\\]@!$&'()*+,;=]*)?`,
		  'gi'
		);
	 
		return content.replace(urlRegex, (match, domain, tld, path) => {
		  const hasProtocol = match.startsWith('http://') || match.startsWith('https://');
		  const url = hasProtocol ? match : `https://${match}`;
		  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
		});
	 }
	 
	 


	return (
	  <StyledMessage ref={pickerRef} isPick={isPick} theme={theme}>
		 {isOpenEmoji && <EmojiMessage onClose={() => setIsOpenEmoji(false)} onSelect={handleSelectEmoji} />}
		 <Menu isActive={isOpenEmoji} theme={theme}>
			<ButtonHover onClick={() => onReply(message)}><IoArrowUndoSharp /></ButtonHover>
			{currentUser?.UUId === user?.UUId && (
			  <>
				 <ButtonHover onClick={() => onRead(message)}><MdEdit /></ButtonHover>
				 <ButtonHover onClick={handleDelete}><IoTrashBin /></ButtonHover>
			  </>
			)}
			{
				message.content.length > 0 &&
				<ButtonHover onClick={() => navigator.clipboard.writeText(message?.content)}><FaCopy /></ButtonHover>
			}
			{pinId === message?.messageUId ?
			  <ButtonHover onClick={() => unPin(message?.messageUId)}><RiUnpinFill /></ButtonHover> :
			  <ButtonHover onClick={() => onPin(message?.messageUId)}><TiPin /></ButtonHover>}
			<ButtonHover isActive={isOpenEmoji} onClick={() => setIsOpenEmoji(!isOpenEmoji)}><MdEmojiEmotions /></ButtonHover>
		 </Menu>
 
		 <Content ref={ref} isReply={true}>
			<Avatar styled={{ position: 'sticky', bottom: '0' }} url={user?.avatar} />
			<ContentMessage myMessage={message.uuid === currentUser.UUId} theme={theme}>
		{message?.replyMessageId ? (
			<>
				<ReplyMessage images={message.images} chatId={chatId} messageId={message?.replyMessageId} theme={theme} />
				{message.images && message.images.length > 0 && <ImageGallery images={message.images} />}
				{
					message.content.length > 0 && <p>{parse(linkifyContent(message.content))}</p>
				}
			</>
		) : (
			<>
				{message.images && message.images.length > 0 && <ImageGallery images={message.images} />}
				{message.videos && message.videos.length > 0 && <VideoGallery theme={theme} videos={message.videos} />}
							{
					message.content.length > 0 && <p>{parse(linkifyContent(message.content))}</p>
				}
			</>
		)}
		<MessageDecore  viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.07789 2.22228C4.86176 -3.27684 7.10069 7.99969 7.10069 7.99969C7.10069 7.99969 10.9509 7.99969 3.0588 7.99969C-4.83334 7.99969 5.29402 7.72141 5.07789 2.22228Z"/>
</MessageDecore>
		</ContentMessage>
				<MessageInfo>
					{message.isEdit && <UpdateIndicator>Изменено</UpdateIndicator>}
					<span>{formatTime(message.data)}</span>
					{
					 isPrivate && isRead ? <IoCheckmarkDone color={theme.accentColor}/> : <IoCheckmark color={theme.accentColor}/>
					}
				</MessageInfo>
		 </Content>
 
		 {message.reactions && message.reactions.length > 0 && (
			<Reactions>
			  {message.reactions.map((r: { emoji: string }, idx: number) => (
				 <ButtonHover key={r.emoji + idx} onClick={() => handleSelectEmoji(r.emoji)}>
					<Avatar onClick={(e)=> {
						handleSelectEmoji(r.emoji)
						e.stopPropagation()}} size={30} url={r.avatar} />
					{getEmojiChar(r.emoji)}
				 </ButtonHover>
			  ))}
			</Reactions>
		 )}
	  </StyledMessage>
	);
 };
 
 // === Кастомное сравнение пропсов ===
 function areEqual(prev: MessageProps, next: MessageProps) {
	const a = prev.message;
	const b = next.message;
 
	return (
	  a.messageUId === b.messageUId &&
	  a.content === b.content &&
	  a.replyMessageId === b.replyMessageId &&
	  a.images?.length === b.images?.length &&
	  a.reactions?.length === b.reactions?.length &&
	  prev.pinId === next.pinId &&
	  prev.chatId === next.chatId &&
	  prev.theme === next.theme
	);
 }
 
 
 const Message = memo(MessageComponent, areEqual);
 export default Message;