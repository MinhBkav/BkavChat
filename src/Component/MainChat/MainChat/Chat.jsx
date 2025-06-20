import { useEffect, useState,useRef } from 'react';
import { chatData } from '../Sidebar/chatData'
import { Emotion } from './Emotion'
import { useSelector } from 'react-redux';
import { WindowMessage } from './WindowMessage';
const TheyChat = ({ mes }) => {
   const isLong = mes.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
    const [modal, setModal] = useState(false)
   
   const timeoutRef = useRef(null)
   const hanlderEnter = () => {
      clearTimeout(timeoutRef.current);
      setShowEmotion(true)
   }
   const hanlderLeave = () => {
      timeoutRef.current = setTimeout(()=>{
          setShowEmotion(false)

      },100)
        }
    const close = () => {
      setModal(false)
   }
   return (
      <div className="relative flex gap-[11px]">
         <div className={`bg-[#E9EAED] dark:bg-slate-600 dark:text-white   max-w-[262px] ${isLong ? "rounded-r-2xl rounded-tl-2xl" : "rounded-r-full rounded-tl-full"} `}>
            {/* <img src="./images/Message.jpg" alt="" className="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]" /> */}
            <p className="py-[4px] px-[15px]">{mes}</p>
         </div>
         <div className=" flex w-[68px] items-center ">
            <button className="relative flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onMouseEnter={()=>hanlderEnter()} onMouseLeave={()=>hanlderLeave()} ><ion-icon name="happy-outline" className="w-[20px] h-[20px] dark:text-[#9c9f9f] border-gray-700 rounded-full focus:text-sky-600 " ></ion-icon></button>
            <Emotion showEmotion={showEmotion} positionE={"right"} hanlderEnter={hanlderEnter} hanlderLeave={hanlderLeave}/>
            <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() =>setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full dark:text-[#9c9f9f] focus:text-sky-600 " ></ion-icon></button>
            <WindowMessage openModal={modal}  positionE={"left"} close = {close}/>
         </div>
      </div>
   )
}  
const MeChat = ({ mes }) => {
   const isLong = mes.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
   const [modal, setModal] = useState(false)
  
   const timeoutRef = useRef(null)
   const hanlderEnter = () => {
      clearTimeout(timeoutRef.current);
      setShowEmotion(true)
   }
   const hanlderLeave = () => {
      timeoutRef.current = setTimeout(()=>{
          setShowEmotion(false)

      },100)
        }
        const close = () => {
      setModal(false)
   }
   return (
      <>
         <div className="relative flex gap-[11px] justify-end">
            <div className=" flex w-[68px] items-center ">
            <button className=" flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() =>setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full dark:text-[#9c9f9f] focus:text-sky-600 " ></ion-icon></button>
               <Emotion showEmotion={showEmotion} positionE={"left"} hanlderEnter={hanlderEnter} hanlderLeave={hanlderLeave}/>
               <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onMouseEnter={()=>hanlderEnter()} onMouseLeave={()=>hanlderLeave()}  ><ion-icon name="happy-outline" className="w-[20px] h-[20px]  border-gray-700 dark:text-[#9c9f9f] rounded-full focus:text-sky-600 " ></ion-icon></button>
               <WindowMessage openModal={modal}  positionE={"right"} close = {close} />
            </div>
            <div className={` bg-[#E0F0FF] dark:bg-blue-600 dark:text-white max-w-[262px] ${isLong ? "rounded-l-2xl rounded-tr-2xl" : "rounded-l-full rounded-tr-full"} `}>
               {/* <img src="./images/Message.jpg" alt="" className ="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]" />  */}
               <p className="py-[4px] px-[15px] ">{mes}</p>
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
      const currentSender = message[i].sender
      while (i < message.length && currentSender === message[i].sender) {
         group.push(message[i].text)
         i++
      }
      groups.push({ sender: currentSender, message: group, id: i, time: message[i - 1].time })
   }
   return groups;
}
export const Chat = () => {
   const chatData = useSelector((state) => state.user.userChat)
   const message = chatData;
   const groupMessage = funcgroupsMessage(message.messages)
   return (
      <>
         <ul className=" z-0 flex-grow flex flex-col justify-end  mx-[8px] gap-[4px] scroll-container " >
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
                        <p className = "dark:text-[#9c9f9f]">{person.time}</p>
                     </div>
                  </li>
               ) : (
                  <li className="flex justify-end gap-[8px]">
                     <div className="flex flex-col gap-[2px] ">
                        {person.message.map(mes => (
                           <MeChat mes={mes} />
                        ))}
                        <div className="flex justify-end items-center">
                           <ion-icon name="checkmark-done-outline" className="w-[20px] h-[20px] mr-[4px] my-auto text-blue-300"></ion-icon>
                           <p className ="dark:text-[#9c9f9f]">{person.time}</p>
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