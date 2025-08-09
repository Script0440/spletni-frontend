import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const createPulse = (color = 'rgba(0,0,0,0.2)') => keyframes`
  0%, 80%, 100% {
    transform: scale(1);
    box-shadow: 0 0 5px ${color};
  }
  40% {
    transform: scale(1.5);
    box-shadow: 0 0 8px ${color};
  }
`;

const FadeBackground = styled.div`
  display: flex;
  flex-direction:row;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.accentColor};
  animation: ${({ theme }) => css`${createPulse(theme.accentColor)} 1.5s infinite`};
  animation-delay: ${({ delay }) => delay};
`;

const LoadingMore = ({ theme }) => {
  return (
    <FadeBackground>
      <Dot delay="0s" theme={theme} />
      <Dot delay="0.3s" theme={theme} />
      <Dot delay="0.6s" theme={theme} />
    </FadeBackground>
  );
};

export default LoadingMore;
