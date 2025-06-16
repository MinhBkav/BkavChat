
import {Limenu} from './Limenu'
import {useRef} from 'react'
import { useClickOutside } from '../../../Hooks/useClickOutside';
export const WindowMessage = ({openModal,positionE,close}) => {
    const ref = useRef(null);
   useClickOutside(ref,close,openModal)
    if (!openModal)
        return null;
    return (
       <div className = "absolute z-20   "  style={{
        top: "calc(100%)",
        ...(positionE === "right" ?{right :"95%"}: {left : "95%"})
      }}
      ref = {ref}
      >
            <ul className = "w-[240px] h-[168px] flex flex-col bg-white dark:bg-slate-600 rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.25)]  overflow-hidden   ">  
                <Limenu icon = "at-outline" text = "Trả lời"  inputcss = "" action = {""}/>
                <Limenu icon = "people-outline" text = "Chỉnh sửa"  inputcss = "" action = {""}/>
                <Limenu icon = "moon-outline" text = "Ghim"  inputcss = "" action = {""}/>
                <Limenu icon = "person-outline" text = "Xóa tin nhắn"  inputcss = "" action = {""}/> 
            </ul>
        </div>
    )
}   