import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import {Router} from './Routes/Router'
import { useTheme } from './Hooks/toggleTheme'
function App() {
  useTheme()
  return (
    <>
     <Router/>
    </>
  )
}

export default App
