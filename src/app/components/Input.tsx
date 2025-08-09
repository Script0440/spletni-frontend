import React, { FormEvent } from 'react'
import { styled, useTheme } from 'styled-components';

type InputProps = {
	type: string,
	placeholder:string,
	value:any,
	onChange:  (event: FormEvent<HTMLInputElement>) => void;
}

const StyledInput = styled.input`
	max-width:500px;
	min-width:300px;
	color:${({ theme }) => theme.color};
	border: 1px solid ${({ theme }) => theme.borderColor};
	  outline: none;
	&:hover{
		transition:0.3s all;
		box-shadow:0px 0px 8px ${({theme})=> theme.color};
	}
	&:focus{
		box-shadow:0px 0px 8px ${({theme})=> theme.accentColor};
	border: 1px solid ${({ theme }) => theme.accentColor} !important;
		border-color:transparent;
	}
	border-radius:5px;
	font-size:16px;
	transition:0.3s all;
	background:transparent;
	padding:10px;
`

const Input: React.FC<InputProps> = ({type,placeholder,value,onChange}) => {
  const { themeObject } = useTheme();


  return (
	 <StyledInput theme={themeObject} type={type} placeholder={placeholder} value={value} onChange={onChange}/>
  )
}

export default Input
