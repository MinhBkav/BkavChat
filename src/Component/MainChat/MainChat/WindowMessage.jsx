
import {Limenu} from './Limenu'
import {useEffect, useRef,useState} from 'react'
import { useClickOutside } from '../../../Hooks/useClickOutside';
export const WindowMessage = ({openModal,positionE,close}) => {
  const ref = useRef(null);
   useClickOutside(ref,close,openModal)
   const [position, setPosition] = useState("bottom");
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

    return (
       <div className = "absolute"  style={{
        ...(position === "top" ?{bottom :"100%"}: {top : "100%"}),
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
export default WindowMessage;