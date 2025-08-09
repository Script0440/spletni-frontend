import React, { useEffect, useRef } from 'react'
import data from '@emoji-mart/data'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'
import ButtonHover from './ButtonHover'

const emojiIds = ['+1', 'fire', 'heart', '-1', 'joy']

const EmojiStyledList = styled.div`
position:absolute;
right:5px;
top:60px;
border: 1px solid ${({theme})=> theme.borderColor};
background: ${({theme})=> theme.background};
z-index:50;
padding:5px;
border-radius:10px;
	width:max-content;
	font-size:16px;
	display:flex;
	gap:10px;
	button:hover{
		transform:scale(1.5)
	}
`


const getEmojiChar = (id) => {
	const emoji = data.emojis[id]
	if (!emoji) return '?'
	const unified = emoji.skins?.[0]?.unified || emoji.unified
	return String.fromCodePoint(...unified.split('-').map(u => parseInt(u, 16)))
 }

const EmojiMessage = ({onClose,onSelect}) => {
	const pickerRef = useRef<HTMLDivElement>(null);
	const {themeObject} = useTheme()

  return (
    <EmojiStyledList theme={themeObject} 
	 ref={pickerRef}
	 >
      {emojiIds.map(id => (
        <ButtonHover onClick={()=> onSelect(id)} key={id}>{getEmojiChar(id)}</ButtonHover>
      ))}
    </EmojiStyledList>
  )
}

export default EmojiMessage
