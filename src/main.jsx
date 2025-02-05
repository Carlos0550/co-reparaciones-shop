import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import es_ES from "antd/locale/es_ES";
import { ConfigProvider } from 'antd';
import { AppContextProvider } from './Context/AppContext.jsx';

import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={es_ES}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
