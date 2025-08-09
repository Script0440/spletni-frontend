"use client"
import styled,{ThemeProvider } from "styled-components";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/header/Header";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Footer from "./components/footer/Footer";
import { GlobalStyles } from "./GlobalStyles";

import { Provider } from 'react-redux';
import { store } from '../app/redux/store';
import { connectSocket } from "./socket";
import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { useUser } from "./hooks/useUser";
import LoadingSpinner from "./components/LoadingSpinner";

const Body = styled.body`
  background: ${({ theme }) => theme.backgroundGradient};
  color: ${({ theme }) => theme.color};
  display:flex;
  margin:0px 120px;
`;
const Content = styled.div`
	width:100%;
`


const queryClient = new QueryClient();


const App = ({children})=>{

	const { emit, on, off } = useSocket();
	const {user} = useUser();
	const PathName = usePathname();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true); // ставим true после монтирования
	}, []);


	useEffect(() => {
		if (!user?.UUId) return;
  
		user.chats.forEach((chatId) => {
		  emit('join', chatId);
  
		  on('messageToRoom', (data) => {
			 const { chatId, message } = data;
			console.log(data)
			 queryClient.setQueryData(['chats', user.chats], (oldChats) => {
				if (!oldChats) return [];
  
				return oldChats.map((chat) => {
				  if (chat.uId !== chatId) return chat;
  
				  return {
					 ...chat,
					 lastMessage: {
						content:data.content,
						timestamp: data.timestamp
					 },
					 noReadMessagesCount: (chat.noReadMessagesCount || 0) + 1,
				  };
				});
			 });
		  });
		});
  
		// Чистим обработчики при демоунте
		return () => {
		  user.chats.forEach((chatId) => {
			 emit('leave', chatId); // если у тебя реализован leave
		  });
  
		  on('messageToRoom', null); // или socket.off('messageToRoom')
		};
	 }, [user?.UUId]);



	return (
		<Body>
			{
				isMounted ? <>
		{(PathName !== '/auth/register' && PathName !== '/auth/login') && <Header/>}
		<Content>
			{children}
		</Content>
						{(PathName !== '/auth/register' && PathName !== '/auth/login') && <Footer/>}
						</> : <LoadingSpinner/>
					}
		</Body>
	)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const {themeObject} = useTheme();

	connectSocket(`${process.env.NEXT_PUBLIC_BASE_URL}`);

  return (
    <html lang="en">
		<head>
		<title>Сплетни</title>
			<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
		</head>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<ThemeProvider theme={themeObject}>
						<App children={children}/>
					<GlobalStyles theme={themeObject}/>
				</ThemeProvider>
			</Provider>
		</QueryClientProvider>
    </html>
  );
}
