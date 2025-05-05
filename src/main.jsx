import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import {BrowserRouter} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/* Can boc BrowserRouter de vi no su dung context API de tuyen vao cac con nhu routes,route */}
    <BrowserRouter> 
      <App />
      <ToastContainer />
      </BrowserRouter>
  </StrictMode>,
)
