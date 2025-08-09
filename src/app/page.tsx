"use client";

import { useRouter } from "next/navigation";
import Header from "./components/header/Header";
import styled from "styled-components";
import Button from "./components/Button";
import { useState } from "react";
import axios from "axios";
import CallModel from "./components/CallModel";

const StyledStart = styled.div`
margin:0px;
padding:0px;
`

export default function Home() {
	const [email,setEmail] = useState('')
	const router = useRouter()
	const [users,setUsers] = useState([])

	const handleGetUser = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
	const res = await axios.get('http://localhost:3001/user/getUsers');
    console.log('Ответ сервера:', res.data);
	 setUsers(res.data.users)
  } catch (err) {
    console.error('Ошибка запроса:', err);
  }
};

  return (
    <StyledStart>
    </StyledStart>
  );
}
