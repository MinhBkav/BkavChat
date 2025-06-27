import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import {Router} from './Routes/Router'
import { useTheme } from './Hooks/toggleTheme'
import useFirebaseNotification from './Hooks/useFirebaseNotification'
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebase'
function App() {
  useTheme()
  useFirebaseNotification();
  return (
    <>
     <Router/>
    </>
  )
}

export default App
