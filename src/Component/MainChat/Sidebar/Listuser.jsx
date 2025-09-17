import { Cardfriend } from "./Cardfriend";
import {CardRoom} from "./CardRoom";
import { useSelector ,useDispatch} from "react-redux";
import { Cardfmobile } from "./Cardfmobile";
import { useEffect } from "react";
import {getListUser } from '../../../feature/dataSlice'

export const Listuser = () =>
{
    const dispatch = useDispatch()
    const friends = useSelector(state=>(state.data.chatData))
    const rooms = useSelector(state=>(state.data.rooms))
    console.log(rooms)
    const openSidebar = useSelector((state) => state.data.openSidebar)
   useEffect(() => {
     dispatch(getListUser());
  // const interval = setInterval(() => {
  // }, 3000); // gọi lại API sau mỗi 1 giây

  // Xóa interval khi component bị hủy (unmount) để tránh leak bộ nhớ
  // return () => clearInterval(interval);
}, []);

    return (
       <>
       <div className = "h-full  custom-scrollbar overflow-y-scroll">
        <ul className = { `h-full ${openSidebar ? "flex flex-col" : "md:flex flex-col hidden"}`}>
         {[...friends, ...rooms]  // gộp 2 mảng
  .slice()               // copy để tránh mutate
  .sort((a, b) => b.unreadCount - a.unreadCount) // sort giảm dần
  .map(item => (
    // nếu có FriendID => friend, ngược lại là room
    item.FriendID 
      ? <Cardfriend key={item.FriendID} user={item} />
      : <CardRoom key={item._id} room={item} />
))}

       </ul>
        <ul className = { `${openSidebar ? "hidden" : "flex flex-col md:hidden"}`}>
         {friends.map(user => (
        <Cardfmobile key={user.FriendID} user={user} />
            ))} 
       </ul>
       </div>
       </>
    )
}
export default Listuser;