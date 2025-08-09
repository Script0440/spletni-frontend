"use client"
import React, { useState } from 'react'
import Form from './Form'
import { useUser } from '../hooks/useUser'
import Input from './Input'
import Button from './Button'
import Avatar from './Avatar'
import styled from 'styled-components'
import { IoMdPhotos } from "react-icons/io";
import { useTheme } from '../hooks/useTheme'
import { BeanHead } from 'beanheads'
import { Modal } from './Modal'
import CreateAvatar from './CreateAvatar'
import Textarea from './Textarea'
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";

const StyledAvatarUpdate = styled.div`
  position: relative;
	display:flex;
	width:max-content;
	align-items:flex-end;
	button{
		background:transparent;
		border:none;
		cursor: pointer;
		width:max-content;
		height:max-content;
	}
  img{
	  width: 120px;
  height: 120px;
  }

  &:hover{
	section{
		position:absolute;
		width:120px;
		height:120px;
		font-size:25px;
		    inset: 0;
    background: ${({theme})=> theme.background}; /* Чёрная плёнка с прозрачностью */
    border-radius: 50%; /* Если аватарка круглая */
	 opacity:50%;
		top:0;
		justify-content:center;
		display:flex;
		align-items:center;
	}
  }
  section{
	  display:none;
	  svg{
		color: ${({theme})=> theme.accentColor};
	  }
  }

  input {
    z-index: 2;
    cursor: pointer;
    opacity: 0;
    position: absolute;
    width: 120px;
    height: 120px;
    top: 0;
    left: 0;
  }
`;

const Sex = styled.div`
	display:flex;
	gap:10px;
`


const UpdateUserForm = () => {
  const { user, updateUser, isUpdating } = useUser()
  const [openCreateAvatarModal,setOpenCreateAvatarModal] = useState(false)
  const [updatedFirstName, setUpdatedFirstName] = useState(user?.firstName || '')
  const [updatedLastName, setUpdatedLastName] = useState(user?.lastName || '')
  const [updatedDescription, setUpdatedDescription] = useState(user?.description ||'')
  const [updatedUId, setUpdatedUId] = useState(user?.uId || ''
  )
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || '')
  const [sex, setSex] = useState(user?.sex || 'male')
const [updatedAvatar, setUpdatedAvatar] = useState<File | null>(null);
const [preview, setPreview] = useState<string | null>(null);
	const {themeObject} = useTheme();


  

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
		const formData = new FormData();
		formData.append('firstName', updatedFirstName || user?.firstName || '');
		formData.append('lastName', updatedLastName || user?.lastName || '');
		formData.append('email', updatedEmail || user?.email || '');
		formData.append('uId', updatedUId || user?.updatedUId || '');
		formData.append('description', updatedDescription || user?.description || '');
		formData.append('sex', sex || user?.sex || '');

		if (updatedAvatar) {
		formData.append('avatar', updatedAvatar);
		}

		await updateUser(formData);
		setUpdatedAvatar(null)

    } catch (err) {
      console.error('Ошибка обновления', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setUpdatedAvatar(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }
};

  return (
    <Form onSubmit={handleUpdate}>
      <Input
        type="text"
        placeholder="First Name"
        value={updatedFirstName}
        onChange={(e) => setUpdatedFirstName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Last Name"
        value={updatedLastName}
        onChange={(e) => setUpdatedLastName(e.target.value)}
		  />
      <Input
        type="text"
        placeholder="id"
        value={updatedUId}
        onChange={(e) => setUpdatedUId(e.target.value)}
		  />
      <Input
        type="email"
        placeholder="Email"
        value={updatedEmail}
        onChange={(e) => setUpdatedEmail(e.target.value)}
		  />
		  <Textarea onChange={(e)=> setUpdatedDescription(e.target.value)} value={updatedDescription} placeholder='Select your description' />
		  <Sex>
			<Button onClick={()=> setSex('male')} isActive={sex === 'male'} type='button'><IoMdMale color='01A6EA'/> Male</Button>
			<Button onClick={()=> setSex('female')} isActive={sex === 'female'} type='button'><IoMdFemale color='FFB1CB'/> Female</Button>
		  </Sex>
		<StyledAvatarUpdate theme={themeObject}>
			<Avatar url={preview}/>
				<input
				type="file"
				onChange={handleFileChange}
				/>
				<section>
					<IoMdPhotos/>
				</section>
				<button type='button' onClick={()=> setOpenCreateAvatarModal(true)}>
					<BeanHead width={50} height={50}/>
				</button>
		</StyledAvatarUpdate>
		<Modal isOpen={openCreateAvatarModal} onClose={()=> setOpenCreateAvatarModal(false)}>
			<CreateAvatar/>
		</Modal>
      <Button type="submit">{isUpdating ? 'Updating...' : 'Change'}</Button>
    </Form>
  )
}

export default UpdateUserForm
