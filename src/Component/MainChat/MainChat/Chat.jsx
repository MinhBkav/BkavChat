import { useEffect, useState, useRef } from 'react';
import { chatData } from '../Sidebar/chatData'
import { Emotion } from './Emotion'
import { useDispatch, useSelector } from 'react-redux';
import { WindowMessage } from './WindowMessage';
import { sUser, getdataChat } from '../../../feature/userSlice'
import AvatarImage from '../../AvatarImage';
import AutoScrollToBottom from '../../AutoScrollToBottom';
import TimeDisplay from '../../../Hooks/TimeDisplay';
import {Timehover} from '../../Timehover';
import { TheyChat } from './TheyChat';
import { MeChat } from './MeChat';

const funcgroupsMessage = (message) => {

   const groups = []
   let i = 0
   while (i < message.length) {
      const group = []
      const currentSender = message[i].MessageType
      while (i < message.length && currentSender === message[i].MessageType) {
         group.push(message[i])
         i++
      }
      groups.push({ sender: currentSender, message: group, id: i, time: message[i - 1].CreatedAt })
   }
   return groups;
}
export const Chat = () => {
   const dispatch = useDispatch()
   const chatData = useSelector((state) => state.user.dataChat)
   const userData = useSelector((state) => state.user.userChat)
   const message = chatData;
   const groupMessage = funcgroupsMessage(message)
   const FriendID = useSelector((state) => state.user.userChat)
   const chatBoxRef = useRef(null);
   // useEffect(() => {
   //    const interval = setInterval(() => {
   //       dispatch(getdataChat(FriendID.FriendID))
   //    }, 100); // gọi lại API sau mỗi 1 giây

   //    // Xóa interval khi component bị hủy (unmount) để tránh leak bộ nhớ
   //    return () => clearInterval(interval);
   // }, [dispatch, FriendID]);
    const handleScroll = () => {
    const chatBox = chatBoxRef.current;
    if (chatBox.scrollTop == 0 && chatData.length > 0) {
      console.log("scroll roi");
      const oldestMessageDate = chatData[0].CreatedAt;
      dispatch(getdataChat(FriendID.FriendID, oldestMessageDate));
    }
  };
   console.log(chatData)
   if(chatData.length == 0)
   {
      return (
         <div className="flex flex-col  flex-1 gap-[4px] ">
            <div className = "m-auto flex flex-col justify-center items-center">
               <img src="./images/EmptyMess.png" alt="" className = "w-28 "/>
            <p className = "font-[500] text-xl text-[#747881]">Chưa có tin nhắn...</p>
            </div>
         </div>
      )
   }
   return (
      <>
         <div className="flex flex-col  flex-1 gap-[4px] overflow-y-scroll " ref = {chatBoxRef}  onScroll={handleScroll} >
            {groupMessage.map((person) => {
               return person.sender == 0 ? (
                  <div className="flex justify-start gap-[8px]">
                     <div className="flex flex-col justify-end">
                        <AvatarImage src={userData.Avatar} inputcss={"w-9 h-9 rounded-full"} />
                     </div>
                     <div className="flex flex-col gap-[2px]">
                        {person.message.map(mes => (
                           <TheyChat mes={mes} />
                        ))}
                        <TimeDisplay isoString={person.time} inputcss={"dark:text-[#9c9f9f]"} />
                     </div>
                  </div>
               ) : (
                  <div className="flex justify-end gap-[8px]">
                     <div className="flex flex-col gap-[2px] ">
                        {person.message.map(mes => (
                           <MeChat mes={mes} />
                        ))}
                        <div className="flex justify-end items-center">
                           <ion-icon name="checkmark-done-outline" className="w-[20px] h-[20px] mr-[4px] my-auto text-blue-300"></ion-icon>
                           <TimeDisplay isoString={person.time} inputcss={"dark:text-[#9c9f9f]"} />
                        </div>
                     </div>
                  </div>
               )
            })}
            <AutoScrollToBottom />
         </div>
      </>
   )
}
export default Chat;       