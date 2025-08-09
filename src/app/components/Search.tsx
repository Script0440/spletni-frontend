import React, { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'
import { IoSearch } from "react-icons/io5";
import Menu from './Menu';
import Avatar from './Avatar';
import { useRouter } from 'next/navigation';
import { useUser } from '../hooks/useUser';
import LoadingSpinner from './LoadingSpinner';
import { useUsers } from '../hooks/useUsers';

const StyledSearch = styled.div`
	border: 1px solid ${({theme})=> theme.color};
	padding:10px;
	width:100%;
	position:relative;
	border-radius:3px;
	display:flex;
	align-items:center;
	min-width:250px;
	svg{
		font-size:20px;
		cursor: pointer;
	}
		transition:0.3s all;

		&:hover{
		transition:0.3s all;
		box-shadow:0px 0px 8px ${({theme})=> theme.color};
	}
	input{
		padding:0px;
	font-size:16px;
	width:100%;
		background:transparent;
		color: ${({theme})=> theme.color};
		border:transparent;
		outline:none;
		&:focus{
			border:transparent;
		}
	}
`

const SearchUser = styled.div`
cursor: pointer;
&:hover{
	border-bottom:1px solid ${({theme})=> theme.accentColor};
}
border-bottom:1px solid ${({theme})=> theme.borderColor};
padding:10px;
margin:5px;
gap:5px;
	display:flex;
	align-items:center;
	justify-content:flex-start;
	div{
		h4{
			font-size:14px;
		}
		h6{
			font-size:12px;
			font-weight:500;
			color:gray;
		}
	}
`

const Users = styled.div`
overflow-y:scroll;
display:flex;
flex-direction:column;
height:calc(100% - 5px);
`

const Empty = styled.div`
	width:100%;
	height:200px;
	justify-content:center;
	display:flex;
	padding:20px;
	align-items:center;
	flex-direction:column;
	text-align:center;
	gap:10px;
	font-size:26px;
	h6{
		color:gray;
		font-weight:500;
		font-size:14px;
	}
`

const User = ({themeObject,data,onClick})=>{
	const {user} = useUser();
	const router = useRouter();

		return (<SearchUser onClick={()=> onClick ? onClick(data) : router.push(`/profile/${data.UUId}`)} theme={themeObject}>
				<Avatar url={data.avatar} size='50px'/>
				<div>
					<h4>{data.firstName} {data.lastName}</h4>
					<h6>@{data.uId.length > 15 ? data.uId.slice(0,12) + "..." : data.uId }</h6>
				</div>
			</SearchUser>)
}

const Search = ({placeholder,onClick}:{placeholder:string,onClick?:()=> void}) => {
	const {user,isLoading} = useUser();
	const [value,setValue] = useState('');
	const {data:users} = useUsers(value);
	const [openMenu,setOpenMenu] = useState(false)
	const {themeObject} = useTheme();

	if(isLoading) return <LoadingSpinner/>
	if(!user) return <div>1</div>
  return (
	 <StyledSearch onClick={()=>setOpenMenu(true) } theme={themeObject}>
		<input placeholder={placeholder} value={value} onChange={(e)=> setValue(e.target.value)} type="text" />
		{
			value.length > 0 && 	<IoSearch/>
		}
		{openMenu && value.length >= 1 && <Menu onClose={()=>setOpenMenu(false)} offsetY={"50px"}>
			{users ? <Users>
				{users?.map((u)=>(
					<User onClick={onClick} data={u} themeObject={themeObject}/>
				))}
			</Users>: <Empty><h4>Нет данных</h4><h6>Попробуйте искать по <br/> ключевым словам</h6></Empty>}
		</Menu>}

	 </StyledSearch>
  )
}

export default Search
