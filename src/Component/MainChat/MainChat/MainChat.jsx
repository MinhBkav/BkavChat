
import {InputChat} from "./InputChat"
import {HeaderUser} from "./HeaderUser"
import {Chat} from "./Chat"
export const MainChat = () => {
    return (
       <main className = "flex flex-col justify-between   bg-white">
        <HeaderUser/>
        <Chat/>
        <InputChat/>
       </main>  
         )
}
export default MainChat;