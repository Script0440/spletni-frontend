import React, { ReactNode, FormEvent } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
	width:100%;
  label{
	width:100%;
	input{
	width:100%;
	}
	display:flex;
	position:relative;
	span{
		border:none;
		background:transparent;
		position:absolute;
		right:20px;
		top:25% !important;
	}
  }
`;

type FormProps = {
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return <StyledForm onSubmit={onSubmit}>{children}</StyledForm>;
};

export default Form;
