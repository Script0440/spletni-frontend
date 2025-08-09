import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from './Button'
import { IoAddCircleOutline } from "react-icons/io5";
import ButtonHover from './ButtonHover';
import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophone } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { useMessages } from '../hooks/useMessages';
import { useUser } from '../hooks/useUser';
import EmojiPicker from './EmojiPicker';
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoArrowUndoSharp } from "react-icons/io5";
import { Modal } from './Modal';
import AddFiles from './AddFiles';
import FileButton from './FileButton';
import AddedFilesChat from './AddedFilesChat';

const SendMessage = styled.div`

	border:1px solid ${(props)=>props.isActive ? props.theme.accentColor : props.theme.color};
	/* background: ${({theme})=> theme.background}; */
	margin:20px;
	margin-top:0px;
	position: relative;
	border-radius:15px;
	border-radius:${({openHeader}) => openHeader && "0px 15px 15px 15px"};
	display:flex;
	justify-content:space-between;
	align-items:flex-end;
	padding:10px;
	gap:20px;
	height:auto;
	&:hover{
		transition:0.3s all;
		border:1px solid ${({theme})=> theme.accentColor};
		section{
		transition:0.3s all;
		border-color:${({theme})=> theme.accentColor};
		}

	}
	label{
		position:relative;
		width:100%;
	}
	textarea{
		resize:none;
		display:flex;
		width:100%;
		padding-right:120px;
		background:transparent;
		border:none;
		outline: none;
		color:${({theme})=> theme.color};
	}
`

const ChatHeader = styled.header`
	display:flex;
	align-items:flex-end;
	margin:20px;
	margin-top:5px;
	margin-bottom:0px;
	position:relative;
`

const Controller = styled.div`
	display:flex;
	gap:10px;
`

const PickMessage = styled.section`
	padding:10px;
	padding-bottom:0px;
	margin-left:20px;
	transition:0.3s all;
	max-width:80%;
	height:max-content;
	overflow:hidden;
	border-radius: 20px 20px 0px 0px;
	border: 1px solid ${({theme})=> theme.borderColor};
	border-bottom:transparent;
	display:flex;
	justify-content:space-between;
	align-items:flex-end;;
	z-index:1;
	button{
		position:absolute;
		right:5px;
		top:5px;
	}
	h5{
		font-size:12px;
		color: ${({theme})=> theme.accentColor};
	}
	h4{
		font-size:14px;
		font-weight:500;
	}
`

const SymbolLimit = styled.span`
	position:absolute;
	right:10px;
	bottom:0;
	${(props)=> props.isFull && `
		color: ${props.theme.accentColor}
	`}
`

const ChatInput = ({emit,clearReplyMessage,replyMessage,clearReadMessage, readMessage,theme,chatId }:{readMessage:object,replyMessage:object,theme:object,chatId:string,clearReplyMessage: ()=> void,clearReadMessage:()=> void}) => {
  const [value, setValue] = useState('');
  const {user} = useUser();
  const [isOpenEmoji,setIsOpenEmoji] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
	const {sendMessage,editMessage} = useMessages(chatId)
	const [documents,setDocuments] = useState(null)
	const [messageFiles,setMessageFiles] = useState(null)
	const [openFileModal,setOpenFileModal] = useState(false)
	
	useEffect(()=>{
		if(documents && documents.length > 0){
			return setOpenFileModal(true)
		} else{
			return setOpenFileModal(false)
		}
	},[documents])

	useEffect(()=>{
		if(readMessage){
			console.log(readMessage)
			setMessageFiles([...readMessage.images,...readMessage.videos])
			setValue(readMessage.content)
			textareaRef.current?.focus()
		}
	},[readMessage])

	useEffect(()=>{
		if(value.length > 0){
			emit('typing', { chatId, sender: user.UUId });
		}else{
			emit('stopTyping', { chatId, sender: user.UUId });
		}
	},[value])

  const handleInput = () => {
	const textarea = textareaRef.current
	if (textarea) {
	  textarea.style.height = 'auto'
	  const newHeight = Math.min(textarea.scrollHeight, 200)
	  textarea.style.height = newHeight + 'px'
	}
 }

 const handleSelectEmoji = (emoji: string) => {
	const textarea = textareaRef.current;
	if (!textarea) return;
 
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const newText = value.slice(0, start) + emoji + value.slice(end);
 
	setValue(newText);
 
	// переместить курсор за вставленным emoji
	setTimeout(() => {
	  textarea.focus();
	  textarea.setSelectionRange(start + emoji.length, start + emoji.length);
	  handleInput();
	}, 0);
 };
 

 const handleSendMessage = () =>{
	if(value.length > 0 || documents.length > 0){
		if(replyMessage){
			if(documents){
				sendMessage({content:value,UUId:user.UUId,images:documents,replyMessageId:replyMessage.messageUId},{onSuccess:(newMessage)=>{
					console.log(newMessage)
					emit('sendMessage',{chatId,replyMessageId:replyMessage.messageUId,...newMessage})
				}})
			}else{
				sendMessage({content:value,UUId:user.UUId,replyMessageId:replyMessage.messageUId},{onSuccess:(newMessage)=>{
					console.log(newMessage)
					emit('sendMessage',{chatId,replyMessageId:replyMessage.messageUId,...newMessage})
				}})
			}
			setValue('')
			setDocuments(null)
			clearReplyMessage()
			textareaRef.current.style.height = '28px'
		}else{
			if(documents){
				sendMessage({content:value,UUId:user.UUId,images:documents},{onSuccess:(newMessage)=>{
					console.log(newMessage)
					emit('sendMessage',{chatId,...newMessage})
				}})
			}else{
				sendMessage({content:value,UUId:user.UUId},{onSuccess:(newMessage)=>{
					console.log(newMessage)
					emit('sendMessage',{chatId,...newMessage})
				}})
			}
			setValue('')
			setDocuments(null)
			textareaRef.current.style.height = '28px'
		}
	}
 }

 const handleChangeMessage = ()=>{
	 if(value.length < 1){
		 alert('Удалить?')
		} else{
			emit('editMessage',{chatId, messageUId: readMessage.messageUId, content:value})
			editMessage({
				messageId:readMessage.messageUId,
				updatedContent: value,
			})
			setMessageFiles(null)
			setValue('')
			clearReadMessage()
			textareaRef.current.style.height = '28px'
		}
 }

 const handleClearChangeMessage = ()=>{
	setValue('')
	clearReadMessage()
	setMessageFiles(null)
	textareaRef.current.style.height = '28px'
 }
 const handleClearReplyMessage = ()=>{
	setValue('')
	clearReplyMessage()
	textareaRef.current.style.height = '28px'
 }

 const handleAddDocuments = (event: React.ChangeEvent<HTMLInputElement>) => {
	const selectedFiles = Array.from(event.target.files || []);
	if (selectedFiles.length === 0) return;
 
	if (documents && documents.length + selectedFiles.length > 10) {
	  // Ограничим до 10 файлов
	  const remainingSlots = 10 - documents.length;
	  selectedFiles.splice(remainingSlots);
	}
 
	if (!documents) {
	  setDocuments(selectedFiles);
	} else {
	  setDocuments((prev) => [...prev, ...selectedFiles]);
	}
 };
 

 const handleDeleteDocument = (event: React.ChangeEvent<HTMLInputElement>) =>{
	setDocuments((prev)=> [...prev.filter((d)=> d !== event)])
 }


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    handleInput()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	if (
		e.key === 'Enter' &&
		!e.shiftKey &&
		!e.altKey &&
		!e.ctrlKey &&
		!e.metaKey
	)	{
		e.preventDefault();
		if(readMessage){
		handleChangeMessage()
		} else{
			handleSendMessage()
		}
	}
};
 

  return (
	<>
		<ChatHeader>
		{((documents && documents.length > 0) || (messageFiles && messageFiles.length > 0)) && (
		<AddedFilesChat
			messageFiles={messageFiles}
			onClick={() => setOpenFileModal(true)}
			documents={documents}
		/>
		)}

	{
			readMessage && <PickMessage theme={theme}>
				<div>
					<h5>Редактирование</h5>
					<h4>{readMessage.content.slice(0,70)}</h4>
				</div>
				<ButtonHover onClick={handleClearChangeMessage} style={{fontSize:"28px"}}>
					<IoClose />
				</ButtonHover>
		</PickMessage>
	}
		{openFileModal && <Modal isOpen={documents} onClose={()=> setOpenFileModal(false)}>
			<AddFiles deleteFile={handleDeleteDocument} addFile={handleAddDocuments} documents={documents}/>
			</Modal>}
		{
			replyMessage && <PickMessage theme={theme}>
				<div>
					<h5>Ответить</h5>
					<h4>{replyMessage.content.slice(0,70)}</h4>
				</div>
				<ButtonHover onClick={handleClearReplyMessage} style={{fontSize:"28px"}}>
					<IoClose />
				</ButtonHover>
		</PickMessage>
		}
</ChatHeader>

    <SendMessage isActive={value.length > 0 ? true : false} openHeader={documents || readMessage && (readMessage.images || readMessage.videos)} theme={theme}>
		<ButtonHover style={{fontSize:"28px",position:'relative'}}>
			<FileButton multiple={true} type="file" onChange={handleAddDocuments}/>
			<IoAddCircleOutline/></ButtonHover>
			<label>

      <textarea
        ref={textareaRef}
        value={value}
		  onChange={handleChange}
		  onKeyDown={handleKeyDown}
        rows={1}
		  maxLength={10000}
        placeholder="Введите сообщение..."
		  />
		  {
			value.length > 500 &&
		  		<SymbolLimit theme={theme} isFull={value.length === 10000}>{value.length}/10000</SymbolLimit>
		  }
		  </label>
		{isOpenEmoji && (
			<EmojiPicker
			offsetY={'-450px'}
			offsetX={'60px'}
			onSelect={handleSelectEmoji}
			/>
		)}

		<Controller>
			<ButtonHover isActive={isOpenEmoji} onClick={()=> setIsOpenEmoji(!isOpenEmoji)} style={{fontSize:"28px"}}><BsEmojiSmile /></ButtonHover>
			{
				readMessage  ? <ButtonHover style={{fontSize:"28px"}} onClick={handleChangeMessage}>
					<FaCheck style={{fontSize:"28px"}}/>
				</ButtonHover> :
							<ButtonHover style={{fontSize:"28px"}} onClick={handleSendMessage}>
							{(value.length >= 1 || documents?.length > 0) ?
							<IoSend style={{fontSize:"28px"}}/> : <PiMicrophone style={{fontSize:"28px"}}/>}
						</ButtonHover>
			}
		</Controller>

    </SendMessage>
	</>
  )
}

export default ChatInput