
import {Limenu} from './Limenu'
export const WindowMessage = ({openModal,positionE}) => {
    if (!openModal)
        return null;
    return (
       <div className = "absolute z-20 left-[11px] top-[70px] "  style={{
        bottom: "calc(80% + 9px)",
        ...(positionE === "right" ?{right :"0%"}: {left : "95%"})
      }}>
            <ul className = "w-[240px] h-[168px] flex flex-col bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.25)] ring-1 ring-slate-50  ">  
                <Limenu icon = "at-outline" text = "Trả lời"  inputcss = "" action = {""}/>
                <Limenu icon = "people-outline" text = "Chỉnh sửa"  inputcss = "" action = {""}/>
                <Limenu icon = "moon-outline" text = "Ghim"  inputcss = "" action = {""}/>
                <Limenu icon = "person-outline" text = "Xóa tin nhắn"  inputcss = "" action = {""}/> 
            </ul>
        </div>
    )
}