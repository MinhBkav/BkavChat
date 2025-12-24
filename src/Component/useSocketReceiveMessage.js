import { useEffect } from "react";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setid } from "../feature/userSlice";
import { setUserOnline } from "../feature/dataSlice";
import { getListUser } from "../feature/dataSlice";
import { sRoom,sUser,getdataChat,isRead} from '../feature/userSlice'
import { updateDeletedMessage,updateRepairMessage,updateEmotionMessage } from "../feature/userSlice";
export default function useSocketReceiveMessage() {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.data.currentuserid);
 const room = useSelector((state) => state.user.userChat);
   const friends = useSelector(state=>(state.data.chatData))
    const rooms = useSelector(state=>(state.data.rooms))
  useEffect(() => {
    const id = sessionStorage.getItem("id");
    const type = sessionStorage.getItem("type");
 if (id) {
  dispatch(setid(id));
  const matchId = String(id);
console.log(matchId)
  if (type === "solo") {
    
    const u = friends.find(f => String(f.FriendID) === matchId);
    console.log(friends.map( f=>f.FriendID))
    if (u){ 
      dispatch(sRoom({type:"solo"}))
            console.log(u)
      dispatch(sUser(u));}
              dispatch(getdataChat(u?.FriendID,null,0))
  } else {
    console.log(rooms.map(r=>r._id))
    const r = rooms.find(rm => String(rm._id) === matchId);
    if (r) {
      dispatch(sRoom({type:"group"}))
      console.log(r)
      dispatch(sUser(r));} // hoặc sUser(r) nếu slice của bạn dùng chung
      dispatch(getdataChat(r?._id,null,1))
  }
}


    socket.on("receive_message", (msg) => {
      // Nếu tin nhắn từ đúng người đang chat thì thêm vào chat
      console.log(msg)
      console.log(currentUserId)
      if ((msg && msg.senderId == currentUserId) ||( msg.roomId == room._id)) {
        console.log("update")
        dispatch(addMessage(msg));
        console.log(msg)
      } else {
        // Gợi ý: Hiện badge hoặc âm thanh
        console.log("📩 Bạn nhận tin nhắn mới từ người khác!");
      
      }
    });
     socket.on("online_users", (onlineUserIds) => {
        dispatch(setUserOnline(onlineUserIds))
        // dispatch(getListUser())
        console.log(onlineUserIds)
    });
    socket.on("message_deleted",(message)=>{
      console.log("da nhan duoc ")
      dispatch(updateDeletedMessage(message))
    });
    socket.on("message_repaired",(message)=>{
       dispatch(updateRepairMessage(message))
    })
    socket.on("message_emotioned",(message)=>{
      console.log("da nhan duoc emotion ",message)
      dispatch(updateEmotionMessage(message))
    })
    return () => {
      socket.off("message_emotioned");
      socket.off("receive_message"); // cleanup
      socket.off("online_users");
      socket.off("message_deleted");
      socket.off("message_repaired");
    };
  }, [dispatch, currentUserId,friends,rooms]);
}
