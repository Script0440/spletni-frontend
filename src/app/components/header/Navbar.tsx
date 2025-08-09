"use client"
import { useTheme } from '@/app/hooks/useTheme';
import { useUser } from '@/app/hooks/useUser';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import styled from 'styled-components'
import LoadingSpinner from '../LoadingSpinner';
import { FaHome } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { BsFillBookmarksFill } from "react-icons/bs";
import { AiFillNotification } from "react-icons/ai";
import { IoIosSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { FaVideo } from "react-icons/fa6";

const StyledNavbar = styled.ul`
	display:flex;
	flex-direction:column;
	width:max-content;
	gap:20px;
	li{
		display:flex;
		gap:10px;
		justify-content:flex-start;
		align-items:center;
		cursor: pointer;
		font-size:20px;
		h4{
			font-weight:500;
		}
	}
`

const StyledLi = styled.li`
transition: 0.3s all;
	color: ${(props)=> props.isActive ? props.theme.accentColor : props.theme.color };
	font-weight: ${({isActive})=> isActive ? '600' : "500"}
`

const Navbar = () => {
	const router = useRouter();
	const pathName = usePathname()
	const {themeObject} = useTheme()
	const {user,isLoading} = useUser();

	
	const navbarList = [
		{
			name: 'Home',
			link: '/',
			icon:<FaHome/>
		},
		{
			name: 'Notifications',
			link: '/notifications',
			icon:<IoIosNotifications/>
		},
		{
			name: 'Messages',
			link: '/messages',
			icon:<AiFillMessage/>
		},
		{
			name: 'Friends',
			link: '/friends',
			icon:<FaUserFriends/>
		},
		{
			name: 'Bookmarks',
			link: '/bookmarks',
			icon:<BsFillBookmarksFill/>
		},
		{
			name: 'VideoClub',
			link: 'https://video-club.live',
			icon: <FaVideo/>
		},
		{
			name: 'Groups',
			link: '/groups',
			icon:<AiFillNotification/>
		},
		{
			name: 'Settings',
			link: '/settings',
			icon:<IoIosSettings/>
		},
		{
			name: 'Profile',
			link: `${user ? `/profile/${user?.uId}` : '/auth/login' }`,
			icon:<FaUser/>
		},
]
  return (
	 <StyledNavbar theme={themeObject}>
		{navbarList.map(n=> <StyledLi theme={themeObject} isActive={pathName === n.link} key={n.name} onClick={(e) => {
			router.push(n.link)}}>
			{n.icon}<h4>{n.name}</h4>
			</StyledLi>)}
	 </StyledNavbar>
  )
}

export default Navbar
