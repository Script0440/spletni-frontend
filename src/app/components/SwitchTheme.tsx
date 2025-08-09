"use client"
import React, { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { CiCloudMoon, CiSun } from 'react-icons/ci';
import Button from './Button';
import styled from 'styled-components';

const StyledCiSun = styled(CiSun)`
	font-size:30px;
`

const StyledCiMoon = styled(CiCloudMoon)`
	font-size:30px;
`

const StyledSwitchButton = styled(Button)`
transition:0.5s all;
	width:max-content;

`

const SwitchTheme = () => {
	const {themeName,toggleTheme} = useTheme()
	const [showText,setShowText] = useState(false)
  return (
	<StyledSwitchButton showSpan={showText} onMouseEnter={() => setShowText(true)} onMouseLeave={()=> setShowText(false)} onClick={()=> toggleTheme()}>
		{themeName === 'dark' ?
			<>
				<StyledCiSun/>
				<span>Light</span>
			</>
		:
		<>
				<StyledCiMoon/>
				<span>Dark</span>
			</>}
		</StyledSwitchButton>)
}

export default SwitchTheme
