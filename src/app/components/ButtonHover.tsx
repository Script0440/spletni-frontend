import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'

const StyledButton = styled.button`
	background:transparent;
	border:transparent;
	margin:0px;
	padding:0px;
	cursor: pointer;
	&:hover{
		color:${({theme})=>theme.color};
		transition:0.3s all;
	}
	transition:0.3s all;
	display:flex;
	align-self:center;
	color:${(props)=> props.isActive ? props.theme.color : props.theme.hoverBgGray}
`

const ButtonHover = ({style,children,onClick,isActive}) => {
	const {themeObject} = useTheme()
  return (
	 <StyledButton isActive={isActive} onClick={onClick} theme={themeObject} style={style}>
		{children}
	 </StyledButton>
  )
}

export default ButtonHover
