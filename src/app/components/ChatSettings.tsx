import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Switcher from './Switcher'
import { useTheme } from '../hooks/useTheme'
import Button from './Button'
import Avatar from './Avatar'
import Textarea from './Textarea'
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlinePermMedia } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import UsersList from './UsersList'
import { TbUserX } from "react-icons/tb";
import { RiUserSettingsLine } from "react-icons/ri";
import ButtonHover from './ButtonHover'
import { Modal } from './Modal'
import Search from './Search'
import { IoMdPersonAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
import FileButton from './FileButton'
import VideosViewer from './VideosViewer'
import ImagesViewer from './ImagesViewer'
import EmptyTextInput from './EmptyTextInput'
import { IoPencil } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";



const SettingsStyled = styled.div`
display:flex;
flex-direction:column;
height:100%;
background:transparent;
gap:20px;
h1{
	display:flex;
	font-size:20px;
}
`

const Buttons = styled.div`
display:flex;
width:100%;
justify-content:space-between;
gap:10px;
`

const ButtonType = styled.button`
	padding:0px;
	cursor: pointer;
	display:flex;
	gap:5px;
	align-items:center;
	font-size:18px;
	border:none;
	color: ${(props)=> props.isActive ? props.theme.accentColor : props.theme.color};
	background:transparent;
`

const SettingsList = styled.ul`
	display:flex;
	flex-direction:column;
	height:100%;
	justify-content:space-between;
	gap:10px;
	div{
		display:flex;
		justify-content:flex-end;
	}
	li{
		display:flex;
		align-items:center;
		gap:10px;
	}
`

const Info = styled.div`
	display:flex;
	justify-content:space-between;
	flex-direction:column;
	gap:20px;
`

const ChatAvatar = styled.div`
position:relative;

img{
	width:125px;
	height:125px;
	border-radius:100%;
	object-fit:cover;
}

&:hover{
	opacity:50%;
}
`

const ChatInfoStyled = styled.div`
	display:flex;
	align-items:center;
	gap:20px;
	span{
		color:${({theme})=> theme.hoverBgGray};
	}
`

const ChatMedias = styled.ul`
	display:flex;
	overflow-y:scroll;
	height:500px;
	flex-wrap:wrap;
	gap:5px;
`

const MediaItem = styled.li`
	width:calc(25% - 5px);
	height:25%;
	&:hover{
		cursor: pointer;
		opacity:50%;
	}
	img{
		object-fit:contain;
		width:100%;
		height:100%;
		aspect-ratio:2/1;
	}
	video{
		object-fit:cover;
		width:100%;
		height:100%;
		aspect-ratio:2/1;
	}
`

const ChatRules = ({ defaultRules,updateRules }) => {
	const [rules, setRules] = useState([
	  {
		 rule: "Могут отправлять эмодзи",
		 value: "canSendEmoji",
		 isActive: defaultRules.canSendEmoji,
	  },
	  {
		 rule: "Могут менять название группы",
		 value: "canChangeName",
		 isActive: defaultRules.canChangeName,
	  },
	  {
		 rule: "Могут отправлять картинки",
		 value: "canSendImages",
		 isActive: defaultRules.canSendImages,
	  },
	  {
		 rule: "Могут закреплять сообщения",
		 value: "canPinMessages",
		 isActive: defaultRules.canPinMessages,
	  },
	  {
		 rule: "Могут Менять Аватар",
		 value: "canChangeAvatar",
		 isActive: defaultRules.canChangeAvatar,
	  },
	  {
		 rule: "Могут отправлять сообщения",
		 value: "canSendMessages",
		 isActive: defaultRules.canSendMessages,
	  },
	  {
		 rule: "Могут отправлять голосовые сообщения",
		 value: "canSendVoiceMessages",
		 isActive: defaultRules.canSendVoiceMessages,
	  },
	  {
		 rule: "Могут создавать групповой звонок",
		 value: "canCreateCallGroup",
		 isActive: defaultRules.canCreateCallGroup,
	  },
	]);
 
	const handleToggle = (value) => {
		console.log('вызвался')
	  setRules((prev) =>
		 prev.map((rule) =>
			rule.value === value ? { ...rule, isActive: !rule.isActive } : rule
		 )
	  );
	};

	const handleSave = () => {
		const newRules = rules.reduce((acc, rule) => {
		  acc[rule.value] = rule.isActive;
		  return acc;
		}, {});
		updateRules(newRules);
	 };
	 
 
	return (
	  <SettingsList>
		 <h2>Общие правила</h2>
 
		 {rules.map((r) => (
			<li key={r.value}>
			  <Switcher isActive={r.isActive} onClick={() => handleToggle(r.value)} /> {r.rule}
			</li>
		 ))}
 
		 <div>
			<Button onClick={() => handleSave()}>
			  Сохранить настройки
			</Button>
		 </div>
	  </SettingsList>
	);
 };
 

const ChatInfo = ({handleOpenInvite,chat,addUser,kickUser,isAddingUser,isKickingUser}) =>{
	return (<div>
		<div>
			<div style={{display:'flex',gap:"10px",alignItems:'center'}}>

			<h2>Участники</h2>
			<ButtonHover onClick={()=> handleOpenInvite(true)}>
				<IoMdPersonAdd size={24}/>
			</ButtonHover>
			</div>
		</div>
		<UsersList buttons={(u)=> <div>
					<ButtonHover onClick={()=> kickUser(u.UUId)}><TbUserX fontSize={24}/></ButtonHover>
				</div>} addUser={addUser} isAddingUser={isAddingUser} isKickingUser={isKickingUser} kickUser={kickUser} label={`Пользователи ${chat.name}`} usersIds={chat.users}/>
		</div>)
}

const ChatMedia = ({media})=>{
	const [showVideoViewer,setShowVideoViewer] = useState(false)
	const [showImageViewer,setShowImageViewer] = useState(false)
	const videos = media.filter((m) => m.mediaType === 'video').map((m) => ({ videoUrl: m.mediaUrl, posterUrl: m.posterUrl }))
	const images =  media.filter((m) => m.mediaType === 'image').map((m) => ({ imageUrl: m.mediaUrl }))
	
	// Viewer-ы не открываются

	return (<ChatMedias>
		{
			showVideoViewer && <VideosViewer startCount={0} onClose={()=> setShowVideoViewer(false)} videos={videos}/>
		}
		{
			showImageViewer && <ImagesViewer startCount={0} onClose={()=> setShowImageViewer(false)} images={images}/>
		}
		{
			media?.map((m)=> m.mediaType === "image"
			?
			<MediaItem key={m.mediaUrl} onClick={()=> setShowImageViewer(true)}>
				<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/${m.mediaUrl}`}/>
			</MediaItem>
			:
			<MediaItem onClick={()=> setShowVideoViewer(true)}>
				<video
				src={`${process.env.NEXT_PUBLIC_BASE_URL}/${m.mediaUrl}`}/>
			</MediaItem>)
		}
	</ChatMedias>)
}

const ChatSettings = ({chat,updateAvatar,kickUser,addUser,isAddingUser,isKickingUser,updateRules,updateName}) => {
	const {themeObject} = useTheme();
	const [type,setType] = useState('home')
	const [openInviteUsers,setOpenInviteUsers] = useState(false);
	const [openEditChat,setOpenEditChat] = useState(false);
	const [newAvatar,setNewAvatar] = useState(null);
	const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
	const [newName,setNewName] = useState(chat.name);
	const [isChangingName,setIsChangingName] = useState(false);


	useEffect(() => {
		if (!newAvatar) {
			setNewAvatarUrl(null);
		  return;
		}
	 
		const objectUrl = URL.createObjectURL(newAvatar);
		console.log("Создан URL:", objectUrl); // добавь сюда
		setNewAvatarUrl(objectUrl);
	 
		return () => {
		  URL.revokeObjectURL(objectUrl); // обязательно чистим!
		};
	 }, [newAvatar]);

	 const handleUpdateAvatar = () => {
		updateAvatar(newAvatar)
		setNewAvatarUrl(null)
		setNewAvatar(null)
	 }


  return (
	 <SettingsStyled theme={themeObject}>
				{
			openInviteUsers && <Modal isOpen={openInviteUsers} onClose={()=> setOpenInviteUsers(false)}>
				<div style={{margin:"20px 0px"}}>
					<h1>Поиск Друзей</h1>
					<Search onClick={(data)=> addUser(data.UUId)}/>
				</div>
			</Modal>
		}
		<Info>
			<ChatInfoStyled theme={themeObject}>
			<ChatAvatar>
				<img src={newAvatarUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/${chat.avatar}`}/>
				<FileButton onChange={(e)=> setNewAvatar(e.target.files?.[0] || null)} type='file'/>
			</ChatAvatar>
			<div style={{display:"flex",flexDirection:'column'}}>
				<div style={{display:'flex'}}>
					<EmptyTextInput onChange={(e)=> setNewName(e.target.value)} isActive={isChangingName} value={newName}/>
						{
							isChangingName ?
							<ButtonHover onClick={()=> {
								setIsChangingName(false)
								if(newName !== chat.name){
									updateName(newName)
								}
								}}>
									<IoCheckmark fontSize={20}/>
							</ButtonHover>
							:
							<ButtonHover onClick={()=> setIsChangingName(true)}>
								<IoPencil fontSize={20}/>
							</ButtonHover>
						}
				</div>
				<span>{chat.users.length} участников, 0 в сети</span>
			</div>
			</ChatInfoStyled>
			{
				newAvatar && 	<div style={{display:'flex',justifyContent:'flex-end'}}>
				<Button onClick={()=>handleUpdateAvatar()}>Сохранить Аватар</Button>
			</div>
			}
		<Buttons theme={themeObject}>
			<ButtonType onClick={()=> setType('home')} isActive={type === 'home'}><AiOutlineHome/> Информация</ButtonType>
			<ButtonType onClick={()=> setType('media')} isActive={type === 'media'}><MdOutlinePermMedia/> Медия</ButtonType>
			<ButtonType onClick={()=> setType('rules')} isActive={type === 'rules'}><IoNewspaperOutline/> Права</ButtonType>
		</Buttons>
		</Info>
		{
			type === 'home' && <ChatInfo handleOpenInvite={()=> setOpenInviteUsers(true)} chat={chat} addUser={addUser} kickUser={kickUser} isAddingUser={isAddingUser} isKickingUser={isKickingUser}/>
		}
		{
			type === 'rules' && <ChatRules defaultRules={chat.defaultRules} updateRules={updateRules}/>
		}
		{
			type === 'media' && <ChatMedia media={chat.media}/>
		}
	 </SettingsStyled>
  )
}

export default ChatSettings
