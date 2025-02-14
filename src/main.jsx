import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import es_ES from "antd/locale/es_ES";
import { ConfigProvider } from 'antd';
import { AppContextProvider } from './Context/AppContext.tsx';

import { BrowserRouter } from 'react-router-dom';
import { themes } from './Context/Typescript/ThemeConfig';
import { ThemeProvider, useTheme } from './Context/ThemeProvider.tsx'; 

// eslint-disable-next-line react-refresh/only-export-components
const RootComponent = () => {
  const { theme } = useTheme(); 

  return (
    <ConfigProvider locale={es_ES} theme={{ token: themes[theme].token, components: themes[theme].components }}>
      <App />
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <ThemeProvider>
          <RootComponent />
        </ThemeProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
