import React, { useEffect, useMemo, useState } from 'react'
import Input from './Input'
import Search from './Search'
import styled, { useTheme } from 'styled-components'
import { IoEarOutline } from 'react-icons/io5'
import { useCreateChat } from '../hooks/useCreateChat'
import { useUser } from '../hooks/useUser'
import { useRouter } from 'next/navigation'
import { useCreateGroupChat } from '../hooks/useCreateGroupChat'
import Button from './Button'
import { renderToStaticMarkup } from 'react-dom/server'
import Avatar from './Avatar'
import { IoClose } from "react-icons/io5";
import ButtonHover from './ButtonHover'


const CreateFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  gap: 20px;
  height:100%;
`

const FormUl = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  height:100%;
  width:100%;
  gap: 10px;
`

const FormUlConrent = styled.div`
	width:100%;
	flex-direction: column;
	display: flex;
	gap: 10px;
`

const TypeChatButtons = styled.div`
  position: relative;
  display: flex;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.color};
  border-radius: 3px;
  background: ${({ theme }) => theme.backgroundDark};
`

const ActiveBackground = styled.div`
  position: absolute;
  top: 0;
  left: ${({ active }) => (active === 'private' ? '0%' : '50%')};
  width: 50%;
  height: 100%;
  background: ${({ theme }) => theme.accentColor};
  transition: left 0.3s ease;
  z-index: 0;
  border-radius: 0px;
`

const TypeButton = styled.button`
  flex: 1;
  padding: 10px;
  background: transparent;
  color: ${({theme})=> theme.color};
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
`

const CreateAvatarGroup = styled.div`
	width:100%;
	display:flex;
	align-items:center;
	gap:20px;
	&:hover{
		opacity:50%;
	}
	h3{
		font-size:16px;
		font-weight:800;
	}
	p{
		font-weight:800;
		font-size:12px;
		color:gray;
	}
	position:relative;
`

const EmptyInput = styled.input`
			width:100%;
			height:100%;
			z-index:5;
			opacity:0;
			top:0;
			left:0;
			position:absolute;
			cursor: pointer;
`


const UsersList = styled.ul`
	display:flex;
	overflow-y:scroll;
	max-height:120px;
	width:100%;
	gap:5px;
	flex-wrap:wrap;
	li{
		position:relative;
		svg{
			position:absolute;
			right:0;
		}
		width:50px;
		height:50px;
	}
`

const GroupAvatar = styled.img`
	width:100px;
	height:100px;
	object-fit:contain;
	border-radius:30px;
	z-index:1;
`

const CreatePrivateChat = () => {
	const {createChat,isCreating,error} = useCreateChat();
	const {user:currentUser,isLoading} = useUser();
	const router = useRouter();

	const handleCreateChat = async (userId:string) => {
		try{
			const newChat = await createChat({userIdOne: userId, userIdTwo:currentUser.UUId})
			router.push(`/messages/${newChat.uId}`)
		} catch(e){
			console.error('Ошибка при создании чата',e)
		}
	}

  return <Search onClick={(data)=> handleCreateChat(data?.UUId)} placeholder='Поиск пользователей' />
}

const CreateGroupChat = () => {
	const { createGroupChat, isPending } = useCreateGroupChat();
	const {user:currentUser,isLoading} = useUser();

	const [loading,setLoading] = useState(false);
	const [file,setFile] = useState(null);
	const [users,setUsers] = useState([]);
	const [name,setName] = useState(null)

	const router = useRouter()

	const getRandomColor = () => {
		const letters = '0123456789ABCDEF'
		let color = '#'
		for (let i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)]
		}
		return color
	 }
	 const randomColor = useMemo(() => getRandomColor(), []);

	 const getNoAvatar = () => {
		setLoading(true);
	 
		const svgString = renderToStaticMarkup(
		  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
			 <rect width="100" height="100" fill={randomColor} />
			 <foreignObject width="100%" height="100%">
				<div
				  xmlns="http://www.w3.org/1999/xhtml"
				  style={{
					 width: '100%',
					 height: '100%',
					 display: 'flex',
					 alignItems: 'center',
					 justifyContent: 'center',
					 fontSize: '40px',
					 color: 'white',
				  }}
				>
				  <IoEarOutline size={60} />
				</div>
			 </foreignObject>
		  </svg>
		);
	 
		const blob = new Blob([svgString], { type: 'image/svg+xml' });
		const fileData = new File([blob], 'no-avatar.svg', { type: 'image/svg+xml' });
		setFile(fileData)
		console.log(fileData)
		setLoading(false)
	 };

	 useEffect(()=>{
		getNoAvatar()
	 },[])

	 const handleCreate = () => {
		if (!name) {
		  return console.log('Необходимо ввести название');
		}
	 
		if (!currentUser) {
		  return console.log('Необходимо авторизоваться');
		}
	 
		createGroupChat(
		  {
			 name,
			 users: users.map((u) => u.UUId),
			 ownerId: currentUser.UUId,
			 avatar: file,
		  },
		  {
			 onSuccess: (newChat) => {
				router.push(`/messages/${newChat.uId}`);
			 },
			 onError: (error) => {
				console.error('Ошибка при создании чата:', error);
			 },
		  }
		);
	 };

	 const handleAddUser = (data) =>{
		const alreadyExists = users.some(user => user.UUId === data.UUId);
		if (alreadyExists) return;
		console.log(file)
		setUsers([...users,data])
	 }

	 const handleDeleteUser = (user) =>{
		setUsers(users.filter(u=> u.UUId !== user.UUId))
	 }



  return (
	<>
    <FormUl>
		<FormUlConrent>

      <Input value={name} onChange={(e)=> setName(e.target.value)} placeholder='Название чата' />
		<CreateAvatarGroup>
		{
			file && <GroupAvatar width={100} src={URL.createObjectURL(file)}/>
		}
			<div>
				<h3>Нажмите что бы загрузить фотографию</h3>
				<p>Не обязательно</p>
			</div>
			<EmptyInput onChange={(e) => setFile(e.target.files?.[0] || null)} type="file" />
			
		</CreateAvatarGroup>
		<UsersList>
			{
				users.map(u=> <li>
					<Avatar onClick={()=> handleDeleteUser(u)} url={u.avatar}/>
				</li>)
			}
		</UsersList>
      <Search onClick={handleAddUser} placeholder='Поиск пользователей' />
		</FormUlConrent>
		<Button disabled={loading} onClick={handleCreate}>Создать</Button>
    </FormUl>
	</>
  )
}

const CreateChatForm = () => {
  const [chatType, setChatType] = useState('private')
  const { themeObject } = useTheme()

  return (
    <CreateFormStyled>
      <h2>Создание чата</h2>
      <TypeChatButtons theme={themeObject}>
        <ActiveBackground active={chatType} theme={themeObject} />
        <TypeButton
          onClick={() => setChatType('private')}
          isActive={chatType === 'private'}
          theme={themeObject}
        >
          Приват
        </TypeButton>
        <TypeButton
          onClick={() => setChatType('group')}
          isActive={chatType === 'group'}
          theme={themeObject}
        >
          Группа
        </TypeButton>
      </TypeChatButtons>
      {chatType === 'private' ? <CreatePrivateChat /> : <CreateGroupChat />}
    </CreateFormStyled>
  )
}

export default CreateChatForm
