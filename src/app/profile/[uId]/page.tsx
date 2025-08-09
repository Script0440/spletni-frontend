"use client"
import React, { useState } from 'react'
import UpdateUserForm from '../../components/UpdateUserForm';
import styled from 'styled-components';
import { useUser } from '../../hooks/useUser';
import LoadingSpinner from '../../components/LoadingSpinner';
import Avatar from '../../components/Avatar';
import { useTheme } from '../../hooks/useTheme';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import { useSubscribe } from '@/app/hooks/useSubscribe';
import { IoMdPersonAdd } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import { Modal } from '@/app/components/Modal';
import useTitle from '../../hooks/useTitle'
import { useCreateChat } from '@/app/hooks/useCreateChat';

const StyledProfile = styled.div`
	display:flex;
	flex-direction:column;
	gap:20px;
`

const Profile = styled.div`
	border-bottom:1px solid ${({theme})=> theme.borderColor};
	width:100%;
`

const UpdateUserContainer = styled.div`
	height:100%;
	display:flex;
	overflow-y:scroll;
`

const BgProfile = styled.img`
	border-bottom:1px solid ${({theme})=> theme.borderColor};

width:100%;
object-fit:cover;
object-position:center;
height:200px;
`

const BgContainer = styled.div`
position:relative;
section{
	display:flex;
	align-items:flex-end;
	justify-content:space-between;
	padding:20px;
}
`

const InfoProfile = styled.div`
	display:flex;
	gap:20px;
	flex-direction:column;
	align-items:flex-start;
ul{
	display:flex;
	padding:0px;
	margin:0px;
	margin-right:50px;
	width:100%;
	max-width:300px;
	list-style-type:none;
	padding:5px;
	justify-content:space-between;
	li{
		font-size:14px;
		span{
			color:${({theme})=> theme.color};
		}
		&:hover{
			color:${({theme})=> theme.color};
		}
		cursor: pointer;
		color:gray;
	}
}
`

const UserAvatar = styled.div`
	display:flex;
	align-items:center;
	gap:10px;
	div{
		h4{
			font-size:18px;
		}
		h6{
			font-size:14px;
			color:gray;
			font-weight:500;
			span{
				color:${({theme})=> theme.color};
			}
		}
	}
`

const ContentProfile = styled.div`
	display:flex;
	justify-content:space-between;
	align-items:center;
	padding:20px;
`

const ActionsProfile = styled.div`
	display:flex;
	gap:10px;
`

const page = () => {
	const pathName = usePathname()
	const router = useRouter()
	const { createChat, isCreating, error:createChatError } = useCreateChat();
	const [openUpdateUserModal,setOpenUpdateUserModal] = useState(false)
	const {user,isLoading,error} = useUser(pathName.replace('/profile/',''));
	const {user:currentUser,updateUser:updateCurrentUser} = useUser();
	const {themeObject} = useTheme();
	const {subscribe, unsubscribe} = useSubscribe()
	useTitle(`${user?.firstName} ${user?.lastName}`)
	if(isLoading) return <LoadingSpinner/>
	if(!user && !isLoading) return <div>Ошибка</div>

	const handleMessage = async ()=>{
		try {
			const newChat = await createChat({userIdOne: user.UUId, userIdTwo:currentUser.UUId});
			console.log('newChat:', newChat);
			router.push(`/messages/${newChat.uId}`)
		 } catch (e) {
			console.error('Ошибка при создании чата', e);
		 }
	}

  return (
	 <StyledProfile>
		<Profile theme={themeObject}>
			<BgContainer>
				<BgProfile theme={themeObject} src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/bg-default-2.png`}/>
			</BgContainer>
				<ContentProfile>
				<InfoProfile theme={themeObject}>
					<UserAvatar theme={themeObject}>
						<Avatar url={user.avatar} size="100px"/>
						<div>
							<h4>{user.firstName} {user.lastName}</h4>
							<h6>
								@{user?.uId.length > 18 ? user?.uId.slice(0,15) + '...' : user?.uId}
							</h6>
							<h6>Пол: <span> {user.sex === 'male' ? 'Мужчина' : "Женщина"}</span></h6>
							<h6>Дата регистрации: <span>{user.registerData}</span></h6>
						</div>
					</UserAvatar>
					<ul>
						<li><span>{user.subscribers.length}</span> Подписчик</li>
						<li><span>{user.friends.length}</span> Друзей</li>
						<li><span>{user.subscriptions.length}</span> Подписок</li>
					</ul>
				</InfoProfile>
				{
					user.UUId === currentUser.UUId ? <Button onClick={()=>setOpenUpdateUserModal(true)}>Изменить профиль</Button> : <ActionsProfile>
					<Button onClick={()=> handleMessage()} style={{fontSize:'16px'}}><AiFillMessage/></Button>
					<Button style={{fontSize:'16px'}}><IoMdPersonAdd/></Button>
					<Button style={{padding:'5px'}} onClick={()=> subscribe.mutate({currentUserId:currentUser.uId, targetUserId:user.uId})}>Подписаться</Button>
				</ActionsProfile>
				}

				</ContentProfile>

		</Profile>
		<Modal onClose={()=> setOpenUpdateUserModal(false)} isOpen={openUpdateUserModal}>
			<UpdateUserContainer>
				<UpdateUserForm/>
			</UpdateUserContainer>
		</Modal>
	 </StyledProfile>
  )
}

export default page
