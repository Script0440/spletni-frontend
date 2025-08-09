import React from 'react'
import { ChangeEvent } from 'react';
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'

const StyledTextarea = styled.textarea`
	background:transparent;
	resize:none;
	width:100%;
	padding:10px;
		max-width:500px;
	font-size:16px;
	min-width:300px;
	height:150px;
	color: ${({theme})=> theme.color};
	word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
		border:1px solid ${({theme})=> theme.color};
	&:focus{
		box-shadow:0px 0px 8px ${({theme})=> theme.accentColor};
		border:1px solid ${({theme})=> theme.accentColor};
		transition:0.3s all;
		outline:none;
	}
	&:focus:hover{
		border: 1px solid ${({theme})=> theme.accentColor};
		box-shadow:0px 0px 8px ${({theme})=> theme.accentColor};
	}
	&:hover{
		box-shadow:0px 0px 8px ${({theme})=> theme.color};
		border: 1px solid ${({theme})=> theme.color};
		transition:0.3s all;
	}
	border-radius:5px;
	transition:0.3s all;
`

type TextareaProps = {
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};


const Textarea = ({ value, placeholder, onChange }: TextareaProps) => {
  const { themeObject } = useTheme();

  return (
    <StyledTextarea
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      theme={themeObject}
    />
  );
}

export default Textarea
