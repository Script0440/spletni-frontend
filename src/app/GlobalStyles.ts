// GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({theme})=> theme.color};
    border: 3px solid transparent;
    background-clip: content-box;
	 border-radius:10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({theme})=> theme.accentColor};
  }
   ::-webkit-scrollbar-corner {
    background: ${({theme})=> theme.background};
  }
`;
