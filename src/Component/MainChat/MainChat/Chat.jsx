import { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getdataChat } from '../../../feature/userSlice';
import { setCheckScroll } from '../../../feature/dataSlice';
import AvatarImage from '../../AvatarImage';
import AutoScrollToBottom from '../../AutoScrollToBottom';
import TimeDisplay from '../../../Hooks/TimeDisplay';
import { TheyChat } from './TheyChat';
import { MeChat } from './MeChat';
const groupDM = (message) => {
   const groups = [];
   let i = 0;
   while (i < message.length) {
      const group = [];
      const currentSender = message[i].MessageType; // 0: họ, 1: mình (theo code của bạn)
      while (i < message.length && currentSender === message[i].MessageType) {
         group.push(message[i]);
         i++;
      }
      groups.push({
         sender: currentSender,
         message: group,
         id: i,
         time: group[group.length - 1].CreatedAt,
      });
   }
   return groups;
};

// Nhóm cho room theo userID
const groupRoom = (message, meId) => {
   const groups = [];
   let i = 0;
   while (i < message.length) {
      const senderId = message[i].userID;
      const group = [];
      while (i < message.length && message[i].userID === senderId) {
         group.push(message[i]);
         i++;
      }
      groups.push({
         senderId,
         isMe: senderId === meId,
         message: group,
         id: i,
         time: group[group.length - 1].CreatedAt,

      });
      console.log( senderId === meId)

   }
   return groups;
};

export const Chat = () => {
   console.log("render")

   const dispatch = useDispatch();

   const chatData = useSelector((state) => state.user.dataChat);
   const infoChat = useSelector((state) => state.user.userChat); // DM: có FriendID; Room: có _id, participants
   const me = JSON.parse(localStorage.getItem("me"));
   const checkrepair = useSelector((state) => state.data.checkrepair);

   const isDM = !!infoChat?.FriendID;
   const participants = infoChat?.participants || [];

   // Map người dùng theo id để lấy avatar/name nhanh
   const participantsById = useMemo(() => {
      const entries = participants.map((u) => [u._id || u.id, u]);
      return Object.fromEntries(entries);
   }, [participants]);

   const message = chatData;
   const grouped = isDM ? groupDM(message) : groupRoom(message, me.id);

   // id để load thêm lịch sử
   const id = isDM ? infoChat.FriendID : infoChat._id;

   const chatBoxRef = useRef(null);

   const handleScroll = () => {
      const chatBox = chatBoxRef.current;
      if (chatBox?.scrollTop === 0 && chatData.length > 0) {
         dispatch(setCheckScroll(true));
         const oldestMessageDate = chatData[0].CreatedAt;
         dispatch(getdataChat(id, oldestMessageDate));
      }
   };

   if (!chatData?.length) {
      return (
          <div className="flex flex-col flex-1 gap-[4px] ">
             <div className="m-auto flex flex-col justify-center items-center">
                <img src="./images/EmptyMess.png" alt="" className="w-28 " />
                <p className="font-[500] text-xl text-[#747881]">Chưa có tin nhắn...</p>
             </div>
          </div>
      );
   }

   return (
       <>
          <div
              className="relative flex flex-col justify-start flex-1 gap-[4px] overflow-y-scroll custom-scrollbar z-30 p-2"
              ref={chatBoxRef}
              onScroll={handleScroll}
          >
             {isDM
                 ? // ========= DM =========
                 grouped.map((person) =>
                     person.sender === 0 ? (
                         <div key={person.id} className="flex justify-start gap-[8px]">
                            <div className="flex flex-col justify-end">
                               {/* avatar của đối phương trong DM */}
                               <AvatarImage
                                   src={infoChat.Avatar}
                                   inputcss="w-9 h-9 rounded-full"
                               />
                            </div>
                            <div className="flex flex-col gap-[2px]">
                               {person.message.map((mes) => (
                                   <TheyChat key={mes.id || mes._id} mes={mes} />
                               ))}
                               <TimeDisplay isoString={person.time} inputcss="dark:text-[#9c9f9f]" />
                            </div>
                         </div>
                     ) : (
                         <div key={person.id} className="flex justify-end gap-[8px]">
                            <div className="flex flex-col gap-[2px] ">
                               {person.message.map((mes) => (
                                   <MeChat key={mes.id || mes._id} mes={mes} />
                               ))}
                               <div className="flex justify-end items-center">
                                  <ion-icon
                                      name="checkmark-done-outline"
                                      className="w-[20px] h-[20px] mr-[4px] my-auto text-blue-300"
                                  ></ion-icon>
                                  <TimeDisplay isoString={person.time} inputcss="dark:text-[#9c9f9f]" />
                               </div>
                            </div>
                         </div>
                     )
                 )
                 : // ========= ROOM =========
                 grouped.map((person) =>
                     person.isMe ? (
                         <div key={person.id} className="flex justify-end gap-[8px]">
                            <div className="flex flex-col gap-[2px] ">
                               {person.message.map((mes) => (
                                   <MeChat key={mes.id || mes._id} mes={mes} />
                               ))}
                               <div className="flex justify-end items-center">
                                  <ion-icon
                                      name="checkmark-done-outline"
                                      className="w-[20px] h-[20px] mr-[4px] my-auto text-blue-300"
                                  ></ion-icon>
                                  <TimeDisplay isoString={person.time} inputcss="dark:text-[#9c9f9f]" />
                               </div>
                            </div>
                         </div>
                     ) : (
                         <div key={person.id} className="flex justify-start gap-[8px]">
                            <div className="flex flex-col justify-end">
                               {/* avatar đúng theo senderId nhờ map */}
                               <AvatarImage
                                   src={participantsById[person.senderId]?.Avatar}
                                   inputcss="w-9 h-9 rounded-full"
                               />
                            </div>
                            <div className="flex flex-col gap-[2px]">
                               {/* nếu muốn hiện tên người gửi trong room */}
                               {/* <span className="text-xs text-gray-400">
                      {participantsById[person.senderId]?.FullName}
                    </span> */}
                               {person.message.map((mes) => (
                                   <TheyChat key={mes.id || mes._id} mes={mes} />
                               ))}
                               <TimeDisplay isoString={person.time} inputcss="dark:text-[#9c9f9f]" />
                            </div>
                         </div>
                     )
                 )}
             <AutoScrollToBottom />
          </div>

          {checkrepair && (
              <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/20 pointer-events-none" />
          )}
       </>
   );
};

export default Chat;
