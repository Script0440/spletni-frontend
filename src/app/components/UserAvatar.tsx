import React from 'react'
import { useUser } from '../hooks/useUser';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import Avatar from './Avatar';
import { HiOutlineLogout } from "react-icons/hi";
import Button from './Button';
import { useLogout } from '../hooks/useLogout';
import { useRouter } from 'next/navigation';

const StyledUserAvatar = styled.div`
	display:flex;
	gap:10px;
	width:max-content;
	h6{
		color:gray;
		font-weight:500;
		font-size:12px;
	}
`

const Name = styled.div`
	display:flex;
	flex-direction:column;
	align-items:flex-start;
	align-self:end;
	padding:5px;
`

const UserAvatar = ({size}) => {
	const { user, isLoading, error } = useUser();
	const {logout,isLoggingOut,logoutError} = useLogout()
	const router = useRouter()
// const {themeObject} = useTheme();

	
if (isLoading) return <div>Загрузка...</div>;

if(!user) return 	 <StyledUserAvatar>

	<Button isActive={true} onClick={()=> router.push('/auth/login')}>Войти</Button>
	<Button onClick={()=> router.push('/auth/register')}>зарегистрироваться</Button>
</StyledUserAvatar>

  return (
	 <StyledUserAvatar>
		<Avatar size={size}/>
		<Name>
			<h4>
				{user?.firstName.length > 15 ? user?.firstName.slice(0,12) + '...' : user?.firstName}
			</h4>
			<h6>
				@{user?.uId.length > 15 ? user?.uId.slice(0,12) + '...' : user?.uId}
			</h6>
		</Name>
			<Button disabled={isLoggingOut} onClick={()=> logout()} style={{padding:'8px',fontSize:"15px"}}><HiOutlineLogout/></Button>
	 </StyledUserAvatar>
  )
}

export default UserAvatar
