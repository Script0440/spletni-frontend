import React from 'react'
import styled, { keyframes, useTheme } from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${({theme})=> theme.color};
  border-top: 5px solid ${({theme})=> theme.accentColor};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;


const LoadingSpinner: React.FC = () => {
	const {themeObject} = useTheme()
  return (
    <Overlay>
      <Spinner theme={themeObject}/>
    </Overlay>
  );
};
export default LoadingSpinner
