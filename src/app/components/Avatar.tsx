"use client"
import React, { useEffect } from 'react'
import { FaUser } from "react-icons/fa";
import styled, { useTheme } from 'styled-components';
import { useUser } from '../hooks/useUser';
import NiceAvatar from 'react-nice-avatar';
import { useRouter } from 'next/navigation';

const StyledAvatar = styled.div`
	display:flex;
	width:max-content;
	border-radius:10px;
	align-items:center;
	img{
		border-radius:100%;
		color:#fff;
		object-position:center;
		object-fit:cover;
	}
	cursor: pointer;
	gap:20px;
	h2{
		font-size:18px;
	}
`

const Avatar = ({url,onClick,size='50px',styled,userId}: {onClick?: ()=> void,url:string,size:string,userId?:string}) => {
const { user, isLoading, error } = useUser();
const {themeObject} = useTheme()
const router = useRouter()
if (isLoading) return <div>Загрузка...</div>;
if (error) return <div>Ошибка: {error.message}</div>;

  return (
	 <StyledAvatar onClick={onClick ? onClick : ()=> router.push(`/profile/${userId ? userId : user.UUId}`)} style={styled} theme={themeObject}>
		<img width={size} height={size} src={url ? `http://localhost:3001/${url}` : `http://localhost:3001/${user.avatar}`} alt="Avatar" />
	 </StyledAvatar>
  )
}

export default Avatar
