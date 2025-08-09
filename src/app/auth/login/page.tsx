"use client";
import React, { useState } from 'react'
import axios from 'axios';
import Form from '@/app/components/Form';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useTheme } from '@/app/hooks/useTheme';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const StyledLogin = styled.div`
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


const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass,setShowPass] = useState(false);
	const router = useRouter();

  	const {themeObject} = useTheme()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      }, { withCredentials: true });
		router.push('/')
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  };

  return (
	 <StyledLogin>
		<h1>Войдите в аккаунт</h1>
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
		  onChange={(e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
      />
		<StyledSubmit theme={themeObject}>
			<div>
				<h4>Нет аккаунт?</h4>
				<span onClick={()=> router.push('/auth/register')}>Зарегистрироваться</span>
			</div>
    		  <Button type="submit">Войти</Button>
		</StyledSubmit>
    </Form>
	 </StyledLogin>
  )
}

export default page
