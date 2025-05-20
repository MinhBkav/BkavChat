import {Sidebar} from "../Component/MainChat/Sidebar/Sidebar";
import {MainChat} from "../Component/MainChat/MainChat/MainChat";

export const Layout = () => {
    return (
    <>
    <div className = "flex w-full">
      <Sidebar/>
      <MainChat/>
    </div>
      </>
    )
}
export default Layout;