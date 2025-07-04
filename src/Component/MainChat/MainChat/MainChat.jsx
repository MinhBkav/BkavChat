
import {InputChat} from "./InputChat"
import {HeaderUser} from "./HeaderUser"
import { useSelector } from 'react-redux'
import {Chat} from "./Chat"
import { useEffect } from "react"
export const MainChat = () => {
      const user = useSelector(state=>state.user.userChat)
      console.log(user)
      console.log( Object.keys(user).length)
      if(!user  ||  Object.keys(user).length === 0)    
        return (
        <main className = " flex flex-col h-screen justify-between bg-white dark:bg-[#171717] flex-1">
        <img src="./images/IconChat.png" alt="Not Found" className = "h-36 m-auto"/>
       </main> 
         )
    else{
       return (
       <main className = " flex flex-col h-screen justify-between bg-white dark:bg-[#171717] flex-1">
        <HeaderUser/>
        <Chat/>
        <InputChat/>
       </main>  
         )
    }
}
export default MainChat;