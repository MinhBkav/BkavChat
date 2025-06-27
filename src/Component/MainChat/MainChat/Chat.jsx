import { useEffect, useState, useRef } from 'react';
import { chatData } from '../Sidebar/chatData'
import { Emotion } from './Emotion'
import { useDispatch, useSelector } from 'react-redux';
import { WindowMessage } from './WindowMessage';
import { sUser, getdataChat } from '../../../feature/userSlice'
import AvatarImage from '../../AvatarImage';
import AutoScrollToBottom from '../../AutoScrollToBottom';
import TimeDisplay from '../../../Hooks/TimeDisplay';
const TheyChat = ({ mes }) => {
   const isLong = mes.Content.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
   const [modal, setModal] = useState(false)

   const timeoutRef = useRef(null)
   const hanlderEnter = () => {
      clearTimeout(timeoutRef.current);
      setShowEmotion(true)
   }
   const hanlderLeave = () => {
      timeoutRef.current = setTimeout(() => {
         setShowEmotion(false)

      }, 100)
   }
   const close = () => {
      setModal(false)
   }
   return (
      <div className="relative flex gap-[11px]">
         <div className={`bg-[#E9EAED] dark:bg-slate-600 dark:text-white   max-w-[262px] ${(isLong|| mes.Images.length > 0 )? "rounded-r-2xl rounded-tl-2xl" : "rounded-r-full rounded-tl-full"} `}>
            {mes.Images?.map((img, index) => (
               <img
                  key={index}
                  src={`http://30.30.30.12:8888/api${img.urlImage}`}
                  alt={img.FileName}
                  className="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]"
               />
            ))}
             {mes.Files?.map((file, index) => (
                            <>
                             <div className = "flex py-[4px] px-[15px]">
                               <a
                                 key={index}
                                 href={`http://30.30.30.12:8888/api${file.urlFile}`} // <-- cần domain backend
                                 download={file.FileName}                        // <-- kích hoạt tải file
                                 target="_blank"                                 // mở tab mới nếu click
                                 rel="noopener noreferrer"
                                 className="text-blue-600 underline block  hover:text-blue-800 "
                              >
                            <ion-icon name="document-outline" className="text-blue-500 " />
                              </a>
                                <p>{file.FileName}</p>
                             </div>
                              </>                          
                           ))}
                           {  mes.Content && (   <p className="py-[4px] px-[15px] ">{mes.Content}</p>)}
         </div>
         <div className=" flex w-[68px] items-center ">
            <button className="relative flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onMouseEnter={() => hanlderEnter()} onMouseLeave={() => hanlderLeave()} ><ion-icon name="happy-outline" className="w-[20px] h-[20px] dark:text-[#9c9f9f] border-gray-700 rounded-full focus:text-sky-600 " ></ion-icon></button>
            <Emotion showEmotion={showEmotion} positionE={"right"} hanlderEnter={hanlderEnter} hanlderLeave={hanlderLeave} />
            <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() => setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full dark:text-[#9c9f9f] focus:text-sky-600 " ></ion-icon></button>
            <WindowMessage openModal={modal} positionE={"left"} close={close} />
         </div>
      </div>
   )
}
const MeChat = ({ mes }) => {
   const isLong = mes.Content.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
   const [modal, setModal] = useState(false)

   const timeoutRef = useRef(null)
   const hanlderEnter = () => {
      clearTimeout(timeoutRef.current);
      setShowEmotion(true)
   }
   const hanlderLeave = () => {
      timeoutRef.current = setTimeout(() => {
         setShowEmotion(false)

      }, 100)
   }
   const close = () => {
      setModal(false)
   }
   return (
      <>
         <div className="relative flex gap-[11px] justify-end">
            <div className=" flex w-[68px] items-center ">
               <button className=" flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() => setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full dark:text-[#9c9f9f] focus:text-sky-600 " ></ion-icon></button>
               <Emotion showEmotion={showEmotion} positionE={"left"} hanlderEnter={hanlderEnter} hanlderLeave={hanlderLeave} />
               <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onMouseEnter={() => hanlderEnter()} onMouseLeave={() => hanlderLeave()}  ><ion-icon name="happy-outline" className="w-[20px] h-[20px]  border-gray-700 dark:text-[#9c9f9f] rounded-full focus:text-sky-600 " ></ion-icon></button>
               <WindowMessage openModal={modal} positionE={"right"} close={close} />
            </div>
            <div className={` bg-[#E0F0FF] dark:bg-blue-600 dark:text-white max-w-[262px] ${(isLong|| mes.Images.length > 0 )  ? "rounded-l-2xl rounded-tr-2xl" : "rounded-l-full rounded-tr-full"} `}>
               {mes.Images?.map((img, index) => (
                  <img
                     key={index}
                     src={`http://30.30.30.12:8888/api${img.urlImage}`}
                     alt={img.FileName}
                     className="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]"
                  />
               ))}
               {mes.Files?.map((file, index) => (
                            <>
                             <div className = "flex py-[4px] px-[15px]">
                               <a
                                 key={index}
                                 href={`http://30.30.30.12:8888/api${file.urlFile}`} // <-- cần domain backend
                                 download={file.FileName}                        // <-- kích hoạt tải file
                                 target="_blank"                                 // mở tab mới nếu click
                                 rel="noopener noreferrer"
                                 className="text-blue-600 underline block  hover:text-blue-800 "
                              >
                            <ion-icon name="document-outline" className="text-blue-500 " />
                              </a>
                                <p>{file.FileName}</p>
                             </div>
                              </>                          
                           ))}
                           {  mes.Content && (   <p className="py-[4px] px-[15px] ">{mes.Content}</p>)}
            </div>
         </div>
      </>
   )
}
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
   console.log(FriendID);

   useEffect(() => {
      const interval = setInterval(() => {
         dispatch(getdataChat(FriendID.FriendID))
      }, 10000); // gọi lại API sau mỗi 1 giây

      // Xóa interval khi component bị hủy (unmount) để tránh leak bộ nhớ
      return () => clearInterval(interval);
   }, [dispatch, FriendID]);
   return (
      <>
         <div className="flex flex-col  flex-1 gap-[4px] overflow-y-scroll " >
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