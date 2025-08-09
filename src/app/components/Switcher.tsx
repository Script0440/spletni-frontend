import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';

const Button = styled.button`
  width: 50px;
  height: 25px;
  padding:0px;
  padding: 5px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background};
  ${({disabled})=> disabled && `
	opacity:50%;
  `}
  border: none;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
`;

const Toggle = styled.div<{ isActive: boolean,disabled:boolean }>`
  position: absolute;
  top: 5px;
  left: ${({ isActive }) => (isActive ? '30px' : '5px')};
  width: 15px;
  height: 15px;
  border-radius: 50%;
  box-shadow:0px 0px 3px ${(props)=> props.isActive ? props.theme.accentColor : props.theme.dangerColor};
	background: ${(props) => props.isActive ? props.theme.accentColor : props.theme.dangerColor};
  transition: 0.3s all;
`;

const Switcher = ({disabled,isActive,onClick}) => {
  const { themeObject } = useTheme();

  return (
    <Button disabled={disabled} onClick={onClick} theme={themeObject}>
      <Toggle isActive={isActive} theme={themeObject} />
    </Button>
  );
};

export default Switcher;
