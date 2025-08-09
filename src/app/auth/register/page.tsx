"use client";
import React, { useState } from 'react'
import axios from 'axios';
import Button from '@/app/components/Button';
import Form from '@/app/components/Form';
import Input from '@/app/components/Input';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useTheme } from '@/app/hooks/useTheme';
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";
import LoadingSpinner from '@/app/components/LoadingSpinner';

const StyledRegister = styled.div`
	width:max-content;
	margin:0 auto;
	display:flex;
	align-self:center;
	height:100%;
	justify-content:center;
	flex-direction:column;
	gap:20px;
`

const StyledSubmit = styled.div`
	display:flex;
	justify-content:space-between;
	gap:20px;
	width:max-content;
	span{
		color:#429bf5;
		cursor: pointer;
	}
`

const Sex = styled.div`
	display:flex;
	gap:10px;
`

const page = () => {
	const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex,setSex] = useState("male");
  const [showPass,setShowPass] = useState(false);

	const {themeObject} = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.BASE_URL}/auth/register`, {
        email,
        password,
		  firstName,
		  lastName,
		  sex
      });
		if(res.data){
			router.push('/auth/login');
		}
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  };

  if(!themeObject) return <LoadingSpinner/>

  return (
	 <StyledRegister>
		<h1>Давайте регистрироваться</h1>
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="FirstName"
        value={firstName}
        onChange={(e: React.FormEvent<HTMLInputElement>) => setFirstName(e.currentTarget.value)}
      />
      <Input
        type="text"
        placeholder="LastName"
        value={lastName}
        onChange={(e: React.FormEvent<HTMLInputElement>) => setLastName(e.currentTarget.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
		  onChange={(e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
      />
		<label htmlFor="">
			<Input
			type={showPass ? "text" : "password"}
			placeholder="Password"
			value={password}
			onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
			/>
{		password.length > 0 && <span onClick={()=> setShowPass(!showPass)}>{showPass ? "Скрыть" : "Показать"}</span>}
		</label>
		<label>
			<Input
			type={showPass ? "text" : "password"}
			placeholder="Repeat password"
			value={repeatPassword}
			onChange={(e: React.FormEvent<HTMLInputElement>) => setRepeatPassword(e.currentTarget.value)}
			/>
		</label>
		  <Sex>
			<Button onClick={()=> setSex('male')} isActive={sex === 'male'} type='button'><IoMdMale color='01A6EA'/> Male</Button>
			<Button onClick={()=> setSex('female')} isActive={sex === 'female'} type='button'><IoMdFemale color='FFB1CB'/> Female</Button>
		  </Sex>
		<StyledSubmit theme={themeObject}>
			<div>
				<h4>Уже есть аккаунт?</h4>
				<span onClick={()=> router.push('/auth/login')}>Авторизоваться</span>
			</div>
    		  <Button type="submit">Создать</Button>
		</StyledSubmit>
    </Form>
	 </StyledRegister>
  )
}

export default page
