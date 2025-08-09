import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'

const StyledButton = styled.button`
	background:transparent;
	overflow-x:hidden;
	gap:5px;
	span{
		opacity:0;
		width:0;
		transition:0.3s all;
		font-weight:700;
	}
	${({showSpan})=> showSpan &&`
		span{
			opacity:100%;
			width:max-content;
			transition:0.3s all;
		}
	`}
	border: 1px solid ${({ theme }) => theme.borderColor};
	border-radius:10px;
	transition:0.3s all;
	cursor: pointer;
	&:hover{
		transition:0.3s all;
		box-shadow:0px 0px 8px ${({theme})=> theme.color};
	}
	width:max-content;
	font-size:16px;
	display:flex;
	align-items:center;
	align-self:center;
	padding:10px;
	color:${({ theme }) => theme.color};
		${(props)=> props.isActive && `
		border: 1px solid ${props.theme.accentColor};
		&:hover{
		box-shadow:0px 0px 8px ${props.theme.accentColor};
		}
	`}
	${({disabled})=>disabled && `
		opacity:50%;
		cursor: not-allowed;
	`}
`

interface ButtonProps {
  isActive?: boolean;
  showSpan?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  style?: string;
  disabled?:boolean;
}

const Button: React.FC<ButtonProps> = ({ disabled,isActive=false, showSpan, onClick, children,onMouseEnter,onMouseLeave,type,style }) => {
  const { themeObject } = useTheme();

  return (
    <StyledButton disabled={disabled} style={style} isActive={isActive} type={type} showSpan={showSpan} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} theme={themeObject}>
      {children}
    </StyledButton>
  );
};


export default Button
