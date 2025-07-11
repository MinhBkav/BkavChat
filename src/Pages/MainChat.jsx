import {Sidebar} from "../Component/MainChat/Sidebar/Sidebar";
import {MainChat} from "../Component/MainChat/MainChat/MainChat";

const PageChat = () => {
       console.log("Đã được render");

    return (
    <>
    <div className = "flex w-full overflow-x-hidden">
      <Sidebar/>
      <MainChat/>
    </div>
      </>
    )
}
export default PageChat;