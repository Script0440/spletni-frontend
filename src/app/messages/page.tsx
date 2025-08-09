"use client"
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useUser } from '../hooks/useUser'
import Avatar from '../components/Avatar'
import { useTheme } from '../hooks/useTheme'
import LoadingSpinner from '../components/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useSocket } from '../hooks/useSocket'
import formatTime from '../../../func/formatTime'
import { useChats } from '../hooks/useChats'
import Search from '../components/Search'
import { TbMessageCirclePlus } from "react-icons/tb";
import ButtonHover from '../components/ButtonHover'
import { MdAddCall } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { Modal } from '../components/Modal'
import Menu from '../components/Menu'
import { FiMoreVertical } from "react-icons/fi";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { GoMute } from "react-icons/go";
import { GoUnmute } from "react-icons/go";
import { FaTrashCan } from "react-icons/fa6";
import { TiPin } from "react-icons/ti";
import { RiUnpinFill } from "react-icons/ri";
import CreateChatForm from '../components/CreateChatForm'
import Button from '../components/Button'
import ConfirmDeleteChat from '../components/ConfirmDeleteChat'
const StyledChats = styled.ul`
display:flex;
flex-direction:column;
width:100%;
height:100%;
ul{
	overflow-y:scroll;
	height:100%;
	padding:0px;
}
`


const StyledMessage = styled.li`
	display:flex;
	align-items:center;
	gap:20px;
	cursor: pointer;
	position:relative;
	h3{
		font-size:20px;
	}
	h5{
		font-weight:500;
		font-size:16px;
		color: ${({theme})=> theme.color}
	}
	span{
		position:absolute;
		right:5px;
		bottom:5px;
		color:${(props)=> props.isNoRead ? props.theme.color : props.theme.hoverBgGray};
	}
	border-bottom:1px solid transparent;
	padding:20px;
	background:${(props)=> props.isPin ? props.theme.background : "transparent"};
	&:hover{
	/* background:${({theme})=> theme.hoverBgGray}; */
	border-bottom:1px solid ${({theme})=> theme.hoverBgGray};
		span{
			color: ${({theme})=> theme.color}
		}
	}
`

const NoReadCount = styled.span`
	height:40px;
	width:40px;
	display:flex;
	align-items:center;
	justify-content:center;
	background:${({theme})=> theme.background};
	color:${({theme})=> theme.color} !important;
	top:10px;
	right:50px !important;
	border-radius:50%;
`

const Container = styled.div`
width:100%;
height:100vh;
`

const MenuContainer = styled.div`
position:absolute;
right:5px;
top:5px;
display:flex;
justify-content:flex-end;
width:300px;
padding:10px 15px;
text-align:start;
div{
	button{
		width:100%;
		align-items:flex-start;
	}
}
button{
	gap:5px;
	display:flex;
	svg{
		font-size:20px !important;
	}
}
`

const Message = ({handleDelete,theme,isPin,isArchive,chat,archiveChat,unarchiveChat,pinChat,
	unpinChat})=> {
	const router = useRouter()
	const [isOpenMenu,setIsOpenMenu] = useState(false)
	const [confirmRemove,setConfirmRemove] = useState(false)

	if(!chat) return <LoadingSpinner/>

	const openMenu = (e) => {
		e.stopPropagation()
		setIsOpenMenu(!isOpenMenu)
	}

	const handleOpenConfirmRemove = (e) =>{
		e.stopPropagation()
		setConfirmRemove(!confirmRemove)
	}



	return (
		<StyledMessage isPin={isPin} isNoRead={chat.noReadMessagesCount} onClick={()=> router.push(`/messages/${chat.uId}`)} theme={theme}>
			<Avatar url={chat.avatar}/>
			<div>
			<h3>{chat.name}</h3>
				<h5>{chat.lastMessage?.content}</h5>
			</div>
			<Modal styled={{height:"max-content"}} isOpen={confirmRemove} onClose={(e)=> handleOpenConfirmRemove(e)}>
				<ConfirmDeleteChat chat={chat} onClose={(e)=> handleOpenConfirmRemove(e)} handleConfirm={()=> handleDelete(chat.uId)}/>
			</Modal>
			{
				chat.noReadMessagesCount > 0 && <NoReadCount theme={theme}>{ chat.noReadMessagesCount < 99 ? chat.noReadMessagesCount : '99+'}</NoReadCount>
			}
			<MenuContainer>
			<ButtonHover isActive={isOpenMenu} onClick={(e)=>openMenu(e)}>
				<FiMoreVertical/>
			</ButtonHover>
			{
				isOpenMenu && <Menu onClose={()=> setIsOpenMenu(false)} offsetX={'-50px'}>
					<div style={{padding:'15px',gap:'8px',display:'flex',flexDirection:'column'}}>
						{
							isArchive ?
							<ButtonHover onClick={()=>unarchiveChat(chat.uId)}><HiArchiveBoxXMark/>Удалить из Архива</ButtonHover>
							: <ButtonHover onClick={()=>archiveChat(chat.uId)}><HiArchiveBoxArrowDown/> Добавить в архив</ButtonHover>
						}

						<ButtonHover onClick={()=>setConfirmRemove(true)}><FaTrashCan/> Удалить чат</ButtonHover>
						{ isPin ? <ButtonHover onClick={()=> unpinChat(chat.uId)}><TiPin/> Открепить чат</ButtonHover> : <ButtonHover onClick={()=> pinChat(chat.uId)}><TiPin/> Закрепить чат</ButtonHover>}
						<ButtonHover><GoMute/> Отключить уведомления</ButtonHover>
					</div>
			</Menu>
			}
			</MenuContainer>
			{
				chat.lastMessage && <span>{formatTime(chat.lastMessage?.timestamp)}</span>
			}
		</StyledMessage>
	)
}

const page = () => {
	const {themeObject} = useTheme();
	const {user, isLoading, error} = useUser();
	const { emit, on, off } = useSocket('http://localhost:3001'); // ⬅️ переместили выше
	const {deleteChat,archiveChat,unarchiveChat,chats,isLoading:isLoadingChats,error:chatError,unpinChat,
		pinChat} = useChats()
	const [isOpenNewChat,setIsOpenNewChat] = useState(false);
	const [openArchiveChatList,setOpenArchiveChatList] = useState(false);


	async function handleDelete(chatId:string) {
		try {
		  await deleteChat(chatId);
		  console.log('Чат удалён');
		} catch (error) {
		  console.error('Ошибка при удалении чата', error);
		}
	 };

	useEffect(() => {
		const handler = (msg: any) => {
			console.log('message:', msg);
		};

		on('message', handler);

		return () => {
			off('message', handler);
		};
	}, [on, off]);

	if (isLoading || isLoadingChats) return <LoadingSpinner/>;

				// Закреплённые чаты. попробовать через состояния
				// Хук для отслежки клика outside
				// Удаление чатов.
				// Начать новый чат с человком через поиск.
				// Поиск чатов.
				// Создание групповых чатов.

	return (
		<Container>
			<StyledChats>
				<div style={{display:'flex',fontSize:"25px",justifyContent:'space-between',padding:"20px"}}>
					<h2> {openArchiveChatList ? "Archive" : "Messages"}</h2>
					<div style={{display:'flex',gap:'10px'}}>
						<ButtonHover onClick={()=> setIsOpenNewChat(true)}><TbMessageCirclePlus/></ButtonHover>
						<ButtonHover onClick={()=> console.log('43')}><MdAddCall/></ButtonHover>
						<ButtonHover isActive={openArchiveChatList} onClick={()=> setOpenArchiveChatList(!openArchiveChatList)}><FaBoxArchive/></ButtonHover>
					</div>
				</div>
				<div style={{margin: '0px 20px 20px 20px'}}>
					<Search placeholder="Поиск чата"/>
					<Modal isOpen={isOpenNewChat} onClose={()=> setIsOpenNewChat(false)}>
						<CreateChatForm/>
					</Modal>
				</div>
				<ul>
				{chats?.filter(chat => user.pinnedChatId.includes(chat.uId)).map(chat => (
				<Message
					isPin={true}
					isArchive={false}
					handleDelete={handleDelete}
					pinChat={pinChat}
					unpinChat={unpinChat}
					archiveChat={archiveChat}
					unarchiveChat={unarchiveChat}
					key={chat.uId}
					chat={chat}
					theme={themeObject}/>))}
				{
  openArchiveChatList
    ? chats
        ?.filter(chat =>
          user.chats.find(c => c.chatId === chat.uId)?.isArchived === true
        )
        .map(chat => (
          <Message
            isArchive={true}
				isPin={false}
				handleDelete={handleDelete}
				pinChat={pinChat}
				unpinChat={unpinChat}
            archiveChat={archiveChat}
            unarchiveChat={unarchiveChat}
            key={chat.uId}
            chat={chat}
            theme={themeObject}
          />
        ))
    : <>


	 {
		chats
		?.filter(chat =>
		  user.chats.find(c => c.chatId === chat.uId)?.isArchived !== true && !user.pinnedChatId.includes(chat.uId)
		)
		.map(chat => (
		  <Message
			 isArchive={false}
			 isPin={false}
			 pinChat={pinChat}
			 handleDelete={handleDelete}
			 unpinChat={unpinChat}
			 archiveChat={archiveChat}
			 unarchiveChat={unarchiveChat}
			 key={chat.uId}
			 chat={chat}
			 theme={themeObject}
		  />
		))
	 }
	 </>
}
				</ul>
			</StyledChats>
		</Container>
	);
};

export default page
