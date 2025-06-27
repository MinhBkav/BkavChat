import { Cardfriend } from "./Cardfriend";
import { useSelector ,useDispatch} from "react-redux";
import { Cardfmobile } from "./Cardfmobile";
import { useEffect } from "react";
import {getListUser } from '../../../feature/dataSlice'

export const Listuser = () =>
{
    const dispatch = useDispatch()
    const chatData = useSelector(state=>(state.data.chatData))
    const openSidebar = useSelector((state) => state.data.openSidebar)
   useEffect(() => {
     dispatch(getListUser());
  // const interval = setInterval(() => {
  // }, 3000); // gọi lại API sau mỗi 1 giây

  // Xóa interval khi component bị hủy (unmount) để tránh leak bộ nhớ
  // return () => clearInterval(interval);
}, []);
console.log(chatData);

    return (
       <>
       <div className = "  ">
        <ul className = { `${openSidebar ? "flex flex-col" : "md:flex flex-col hidden"}`}>
         {chatData.map(user => (
        <Cardfriend key={user.FriendID} user={user} />
            ))} 
       </ul>
        <ul className = { `${openSidebar ? "hidden" : "flex flex-col md:hidden"}`}>
         {chatData.map(user => (
        <Cardfmobile key={user.FriendID} user={user} />
            ))} 
       </ul>
       </div>
       </>
    )
}
export default Listuser;