import React from 'react'
import Button from './Button'
import styled from 'styled-components'
import Avatar from './Avatar'

const ConfirmDeleteChatStyled = styled.div`
	display:flex;
	flex-direction:column;
	gap:20px;
	h1{
		font-size:30px;
	}
	span{
		color:gray;
		font-size:14px;
		font-weight:500;
	}
	div{
		display:flex;
		align-items:center;
		gap:10px;
	}
`

const ConfirmDeleteChat = ({chat,handleConfirm,onClose}:{handleConfirm:()=> void,onClose:()=> void}) => {
  return (
	 <ConfirmDeleteChatStyled>
		<div style={{flexDirection:'column',alignItems:'start'}}>
			<h1>Удалить чат?</h1>
			<span>Вся история сообщений и данные будут утеряны навсегда!</span>
		</div>
		<div>
			<Avatar url={chat.avatar}/>
			<h4>{chat.name}</h4>
		</div>
		<div>
			<Button onClick={handleConfirm}>Подтвердить</Button>
			<Button onClick={onClose}>Отменить</Button>
		</div>
	 </ConfirmDeleteChatStyled>
  )
}

export default ConfirmDeleteChat
