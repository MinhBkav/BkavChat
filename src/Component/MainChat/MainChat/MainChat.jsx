
import {InputChat} from "./InputChat"
import {HeaderUser} from "./HeaderUser"
import { useSelector } from 'react-redux'
import {Chat} from "./Chat"
import { useEffect } from "react"
export const MainChat = () => {
      // const user = useSelector(state=>state.user.userChat)
      // if(!user == false ||  Object.keys(userChat).length === 0)    
      //   return (
      //   <main className = " flex flex-col h-screen justify-between bg-white dark:bg-[#171717] flex-1">
      //   <img src="" alt="" />
      //  </main> 
      //    )
    
    return (
       <main className = " flex flex-col h-screen justify-between bg-white dark:bg-[#171717] flex-1">
        <HeaderUser/>
        <Chat/>
        <InputChat/>
       </main>  
         )
}
export default MainChat;