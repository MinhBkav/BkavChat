import { useEffect, useState } from 'react';
import { chatData } from '../Sidebar/chatData'
import { Emotion } from './Emotion'
import { useSelector } from 'react-redux';
import { WindowMessage } from './WindowMessage';
const TheyChat = ({ mes }) => {
   console.log(mes.length)
   const isLong = mes.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
    const [modal, setModal] = useState(false)
   const setShow = () => {
      setShowEmotion(!showEmotion)
   }
   // const openModal = () => {
   //    setModal(!modal)
   // }
   return (
      <div className="relative flex gap-[11px]">
         <div className={`bg-[#E9EAED]   max-w-[262px] ${isLong ? "rounded-r-2xl rounded-tl-2xl" : "rounded-r-full rounded-tl-full"} `}>
            {/* <img src="./images/Message.jpg" alt="" className="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]" /> */}
            <p className="py-[4px] px-[15px]">{mes}</p>
         </div>
         <div className=" flex w-[68px] items-center ">
            <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() => setShow()} ><ion-icon name="happy-outline" className="w-[20px] h-[20px]  border-gray-700 rounded-full focus:text-sky-600 " ></ion-icon></button>
            <Emotion showEmotion={showEmotion} positionE={"right"} />
            <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() =>setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full focus:text-sky-600 " ></ion-icon></button>
            <WindowMessage openModal={modal}  positionE={"left"} />
         </div>
      </div>
   )
}  
const MeChat = ({ mes }) => {
   const isLong = mes.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
   const setShow = () => {
      setShowEmotion(!showEmotion)
   }
   return (
      <>
         <div className="relative flex gap-[11px] justify-end">
            <div className=" flex w-[68px] items-center ">
               <ion-icon name="ellipsis-vertical" className="flex-1 w-[20px] h-[20px] "></ion-icon>
               <Emotion showEmotion={showEmotion} positionE={"left"}/>
               <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() => setShow()} ><ion-icon name="happy-outline" className="w-[20px] h-[20px]  border-gray-700 rounded-full focus:text-sky-600 " ></ion-icon></button>
            </div>
            <div className={` bg-[#E0F0FF] max-w-[262px] ${isLong ? "rounded-l-2xl rounded-tr-2xl" : "rounded-l-full rounded-tr-full"} `}>
               {/* <img src="./images/Message.jpg" alt="" className ="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]" />  */}
               <p className="py-[4px] px-[15px] ">{mes}</p>
            </div>
         </div>
      </>
   )
}
const funcgroupsMessage = (message) => {
   console.log(message)
   console.log(message[message.length - 1])

   const groups = []
   let i = 0
   while (i < message.length) {
      const group = []
      const currentSender = message[i].sender
      while (i < message.length && currentSender === message[i].sender) {
         group.push(message[i].text)
         i++
      }
      groups.push({ sender: currentSender, message: group, id: i, time: message[i - 1].time })
      console.log(message[message.length - 1].time)
   }
   return groups;
}
export const Chat = () => {
   const chatData = useSelector((state) => state.user.userChat)
   const message = chatData;
   const groupMessage = funcgroupsMessage(message.messages)
   return (
      <>
         <ul className="w-[calc(100vw-361px -20px)] z-0 flex-grow flex flex-col justify-start mt-[10px] mx-[8px] gap-[4px] ">
            {groupMessage.map((person) => {
               return person.sender === "them" ? (
                  <li className="flex justify-start gap-[8px]">
                     <div className="flex flex-col justify-end">
                        <img src={message.avatar} alt="avatar" className="w-9 h-9 rounded-full" />
                     </div>
                     <div className="flex flex-col  gap-[2px]">
                        {person.message.map(mes => (
                           <TheyChat mes={mes} />
                        ))}
                        <p>{person.time}</p>
                     </div>
                  </li>
               ) : (
                  <li className="flex justify-end gap-[8px]">
                     <div className="flex flex-col gap-[2px] ">
                        {person.message.map(mes => (
                           <MeChat mes={mes} />
                        ))}
                        <div className="flex justify-end items-center">
                           <ion-icon name="checkmark-done-outline" className="w-[20px] h-[20px] mr-[4px] my-auto text-blue-700"></ion-icon>
                           <p>{person.time}</p>
                        </div>
                     </div>
                  </li>
               )
            })}
         </ul>
      </>
   )
}
export default Chat;       