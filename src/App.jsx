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
import useSocketReceiveMessage from './Component/useSocketReceiveMessage'
import { connectSocket } from '../socket'
function App() {
  useTheme()
  useFirebaseNotification();
  useSocketReceiveMessage();
  connectSocket();
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((reg) => console.log('✅ SW registered:', reg.scope))
        .catch(console.error);
    }
  }, []);
  return (
    <>
     <Router/>
    </>
  )
}

export default App
