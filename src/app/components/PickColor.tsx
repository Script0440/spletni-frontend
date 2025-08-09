"use client"
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import { IoIosColorPalette } from "react-icons/io";
import Button from './Button';
import { useTheme } from '../hooks/useTheme';

const StyledColorPicker = styled.div`
button{
	font-size:30px;
}
.chrome-picker {
	position:absolute;
	z-index:50;
}
.chrome-picker .flexbox-fix .flexbox-fix {
  display: none !important;
}
.chrome-picker{
	background:${({theme})=> theme.background} !important;
	border-radius:15px !important;
		border-radius:0px !important;
	div{
		
		border:1px solid ${({theme})=> theme.color};
		div{
			border:transparent;
		}
	}
}
.chrome-picker  .flexbox-fix{
	background:${({theme})=> theme.background} !important;
}
.chrome-picker .flexbox-fix:nth-child(2){
  display: none !important;

}
`

const ColorPicker = ({getColor}: {getColor: any}) => {
  const [color, setColor] = useState('#fff');
  const [showPicker,setShowPicker] = useState(false)
	const {themeObject} = useTheme()
  return (
    <StyledColorPicker theme={themeObject}>
	<Button onClick={()=> setShowPicker(!showPicker)}><IoIosColorPalette/></Button>
	{
		showPicker && <ChromePicker
        color={color}
		  disableAlpha
        onChange={(updatedColor) => getColor(updatedColor.hex)}
		  />
	}
    </StyledColorPicker>
  );
};

export default ColorPicker;
