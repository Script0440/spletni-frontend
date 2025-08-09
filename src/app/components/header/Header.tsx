"use client"
import React from 'react'
import styled from 'styled-components'
import { useTheme } from '@/app/hooks/useTheme'
import Logo from './Logo'
import Navbar from './Navbar'
import UserAvatar from '../UserAvatar'

const StyledHeader = styled.header`
	border-right: 1px solid ${({ theme }) => theme.borderColor};
	padding:20px;
	display:flex;
	width:30%;
	overflow:hidden;
	height:100vh;
	flex-direction:column;
	align-self:start;
	align-items:flex-start;
	justify-content:space-between;
	gap:10px;
`

const Header = () => {
	const {themeObject} = useTheme()
  return (
	 <StyledHeader theme={themeObject}>
		<Logo/>
		<Navbar/>
		<UserAvatar size="50px"/>
	 </StyledHeader>
  )
}

export default Header
