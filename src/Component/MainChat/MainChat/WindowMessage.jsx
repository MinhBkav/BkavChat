
import {Limenu} from './Limenu'
import {useEffect, useRef,useState} from 'react'
import { useClickOutside } from '../../../Hooks/useClickOutside';
import { deleteMessage } from '../../../feature/userSlice';
import { useDispatch,useSelector } from 'react-redux';
import { setInputMessage,setCheckRepair } from '../../../feature/dataSlice';
import{setMessageReply} from "../../../feature/userSlice";
import { setMessageId,setMessagechose } from '../../../feature/userSlice';
export const WindowMessage = ({openModal,positionE,close,mes,onReply}) => {
  const ref = useRef(null);
  const dispatch = useDispatch()
   useClickOutside(ref,close,openModal)
   const [position, setPosition] = useState("bottom");
    const inputMessage = useSelector((state) => state.data.inputMessage)
     useEffect(() => {
    if (openModal && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 150 && spaceAbove > 150) {
        setPosition("top"); // nếu không đủ không gian phía dưới → bật lên trên
      } else {
        setPosition("bottom");
      }
    }
  }, [openModal]);
    if (!openModal ){
        return null;
    }
    const handledeleteMessage = () =>{
        dispatch(deleteMessage(mes.id))
        dispatch(setMessageReply({}))
        dispatch(setCheckRepair(false))
        console.log(mes.id)
    }
    const handlerepairMessage = () =>{
       dispatch(setMessageId(mes.id))
        dispatch(setCheckRepair(true))
        dispatch(setMessageReply({}))
        dispatch(setInputMessage(mes.Content))
        console.log(mes.Content)
        console.log(inputMessage)
    }

    console.log(mes)
    if(mes.isDelete)
      return
    const handleReply = async () => {
        if (!onReply) return;
        dispatch(setCheckRepair(false))
        dispatch(setMessagechose(mes))
        const size = await onReply(); // 👈 nhận lại kích thước từ cha
        console.log("↩️ Kích thước MeChat:", size);

    };
    return (
       <div className = "absolute"  style={{
        ...(position === "top" ?{bottom :"100%"}: {top : "100%"}),
        ...(positionE === "right" ?{right :"95%"}: {left : "95%"})
      }}
      ref = {ref}
      >
            <div className = "w-[240px] h-[168px] flex flex-col bg-white dark:bg-slate-600 rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.25)]  overflow-hidden   ">  
                <Limenu icon = "at-outline" text = "Trả lời"  inputcss = "" action = {handleReply} close = {close}/>
                <Limenu icon = "people-outline" text = "Chỉnh sửa"  inputcss = "" action = {handlerepairMessage}  close = {close}/>
                <Limenu icon = "moon-outline" text = "Ghim"  inputcss = "" action = {""}/>
                <Limenu icon = "person-outline" text = "Xóa tin nhắn"  inputcss = "" action = {handledeleteMessage}  close = {close}/>
            </div>
        </div>
    )
}   
export default WindowMessage;