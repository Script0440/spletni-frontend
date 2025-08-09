import React, { ReactNode, CSSProperties, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'

interface StyledButtonProps {
	isActive?: boolean
 }

const StyledButton = styled.button<StyledButtonProps>`
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

interface ButtonHoverProps {
  style?: CSSProperties
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

const ButtonHover: React.FC<ButtonHoverProps> = ({ style, children, onClick, isActive }) => {
	const {themeObject} = useTheme()
  return (
	 <StyledButton isActive={isActive} onClick={onClick} theme={themeObject} style={style}>
		{children}
	 </StyledButton>
  )
}

export default ButtonHover
