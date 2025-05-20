
import {InputChat} from "./InputChat"
import {HeaderUser} from "./HeaderUser"
export const MainChat = () => {
    return (
       <div className = "flex-grow bg-white">
        <HeaderUser/>
        <InputChat/>
       </div>  
         )
}
export default MainChat;