import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'
import { useClickOutside } from '../hooks/useClickOutside.ts'; // путь подкорректируй по проекту

const StyledMenu = styled.div`
position:absolute;
top:${({offsetY})=> offsetY ? offsetY : 0};
left:${({offsetX})=> offsetX ? offsetX : 0};
z-index:100;
width:100%;
max-width: ${({maxWidth})=> maxWidth ? maxWidth : "100%"};
background:${({theme})=> theme.background};
		transition:0.3s all;
&:hover{
		transition:0.3s all;
	box-shadow:0px 0px 8px ${({theme})=> theme.color};
}
height:auto;
overflow-y:scroll;
max-height:300px;
	border: 1px solid ${({theme})=> theme.color};
`

const Menu = ({offsetY,onClose,offsetX,children,maxWidth}:{offsetY:string,offsetX:string,children:any,maxWidth:string,onClose:() => void}) => {
	const {themeObject} = useTheme()

	const menuRef = useClickOutside<HTMLDivElement>(() => onClose());
	
  return (
	 <StyledMenu  ref={menuRef} onClick={(e)=> e.stopPropagation()} maxWidth={maxWidth} offsetX={offsetX} offsetY={offsetY} theme={themeObject}>
		{children}
	 </StyledMenu>
  )
}

export default Menu
