
import {InputChat} from "./InputChat"
import {HeaderUser} from "./HeaderUser"
import {Chat} from "./Chat"
export const MainChat = () => {
    return (
       <main className = "relative flex flex-col justify-between bg-white dark:bg-[#171717] flex-1">
        <HeaderUser/>
        <Chat/>
        <InputChat/>
       </main>  
         )
}
export default MainChat;