// src/main.jsx hoặc src/index.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntdApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

import App from './App.jsx';
import store from './Store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider
          locale={viVN}
          theme={{ token: { colorPrimary: '#1677ff', borderRadius: 8 } }}
        >
          <AntdApp>
            <App />
            {/* Để ToastContainer ở gần root; có thể để đây */}
            <ToastContainer />
          </AntdApp>
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
