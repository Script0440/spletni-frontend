import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, {css} from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import ButtonHover from './ButtonHover';
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  styled: React.ComponentType<any>;
  children: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* прозрачный тёмный фон */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({theme})=> theme.backgroundDark};
  border:1px solid ${({theme})=> theme.color};
  padding: 20px;
  margin:20px;
  border-radius: 12px;
  max-width: 500px;
  max-height: 800px;
  overflow:hidden;
  height:100%;
  width: 100%;
  position: relative;
  ${({ styled }) => styled && css`${styled}`};
`;

export const Modal: React.FC<ModalProps> = ({ styled, isOpen, onClose, children }) => {
	const {themeObject} = useTheme();
	
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <ModalContent styled={styled} theme={themeObject} onClick={(e) => e.stopPropagation()}>
			<ButtonHover style={{position:'absolute',fontSize:"28px",right:'10px',top:"10px"}} onClick={onClose}><IoClose/></ButtonHover>
        {children}
      </ModalContent>
    </Overlay>,
    document.body // Рендерим модалку в body
  );
};
