import { useEffect } from "react";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../feature/userSlice";
import { setUserOnline } from "../feature/dataSlice";
import { getListUser } from "../feature/dataSlice";
export default function useSocketReceiveMessage() {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.data.currentuserid);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      // Nếu tin nhắn từ đúng người đang chat thì thêm vào chat
      console.log(msg)
      console.log(currentUserId)
      if (msg && msg.senderId == currentUserId) {
        dispatch(addMessage(msg));
        console.log(msg)
      } else {
        // Gợi ý: Hiện badge hoặc âm thanh
        console.log("📩 Bạn nhận tin nhắn mới từ người khác!");
      
      }
    });
     socket.on("online_users", (onlineUserIds) => {
        dispatch(setUserOnline(onlineUserIds))
        dispatch(getListUser())
        console.log(onlineUserIds)
    });

    return () => {
      socket.off("receive_message"); // cleanup
      socket.off("online_users");
    };
  }, [dispatch, currentUserId]);
}
