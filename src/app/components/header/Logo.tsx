"use client"
import React from 'react'
import { IoEarOutline } from "react-icons/io5";
import { IoEarSharp } from "react-icons/io5";
import styled from 'styled-components';
import { useTheme } from './../../hooks/useTheme';
import { useRouter } from 'next/navigation';



const StyledLogo = styled.a`
	width:max-content;
	display:flex;
	align-self:flex-start;
	text-align:start;
	cursor: pointer;
	h2{
		font-size:18px;
		display:flex;
	align-self:center;
	}
	button{
		background:transparent;
		border:transparent;
		display:flex;
	align-self:center;
		color: ${({ theme }) => theme.color};
		cursor: pointer;
	}
	.earsharp{
		display:none;
	}
	&:hover{
	.earsharp{
		display:flex;
	}
	.earoutline{
		display:none;
		}
	}
`

const Logo = () => {
	const {themeObject} = useTheme()
	const router = useRouter()
  return (
	 <StyledLogo onClick={()=> router.push('/')} theme={themeObject}>
		<h2>Сплетни</h2>
		<button className='earsharp'>
			<IoEarSharp size={40}/>
		</button>
		<button className='earoutline'>
			<IoEarOutline size={40}/>
		</button>
	 </StyledLogo>
  )
}

export default Logo
