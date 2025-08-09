import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import { useManyUsers } from '../hooks/useManyUsers';
import styled from 'styled-components';
import Avatar from './Avatar';
import ButtonHover from './ButtonHover';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';

const User = styled.li`
	display:flex;
	justify-content:space-between;
	div{
	display:flex;
	align-items:center;
	gap:10px;
}
padding-bottom:5px;
border-bottom:1px solid transparent;
&:hover{
	border-bottom:1px solid ${({theme})=> theme.accentColor}
}
`

const Users = styled.ul`
	display:flex;
	flex-direction:column;
	gap:10px;
`

const Buttons = styled.div`
display:flex;
gap:10px;
padding:5px;
`

const StyledUsersList = styled.div`
display:flex;
overflow-y:scroll;
max-height:500px;
height:100%;
flex-direction:column;
gap:30px;
margin:20px 0px;
	h1{
		font-size:28px;
	}
`


const UsersList = ({label,buttons,usersIds,addUser,kickUser}:{addUser:()=> void,kickUser:()=> void,label:string,usersIds:string[]}) => {
	const {data:users,isLoading,error} = useManyUsers(usersIds);
	const {themeObject} = useTheme();
	if(isLoading) return <LoadingSpinner/>

  return (
	 <StyledUsersList>
		<Users>
		{
			users?.map((u)=> <User theme={themeObject}>
					<div>
						<Avatar userId={u.UUId} url={u.avatar}/>
						{u.firstName}
					</div>
					<Buttons>
						{
							buttons(u)
						}
					</Buttons>
				</User>
			)
		}
		</Users>
	 </StyledUsersList>
  )
}

export default UsersList
