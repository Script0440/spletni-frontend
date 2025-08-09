import { useTheme } from '@/app/hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import SwitchTheme from '../SwitchTheme'
import Search from '../Search'

const StyledFooter = styled.footer`
	height:100vh;
	width:max-content;
	display:flex;
	flex-direction:column;
	gap:20px;
	padding:30px;
	border-left: 1px solid ${({ theme }) => theme.borderColor};
`

const Footer = () => {
		const {themeObject} = useTheme()
  return (
	 <StyledFooter theme={themeObject}>
		<Search/>
		<SwitchTheme/>
	 </StyledFooter>
  )
}

export default Footer
