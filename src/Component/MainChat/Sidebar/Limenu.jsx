export const Limenu = ({icon,text,action,inputcss}) => {
   return (
     <li className="flex-1 ">
        <div className="flex justify-between  m-4">
            <div className="flex justify-between items-center gap-4 ">
                <ion-icon name={icon} className="w-[24px] h-[24px] text-[#747881] "></ion-icon>
                <h2 className="font-[500] text-base">{text}</h2>
            </div>
            <div className = {inputcss}>{action}</div>
        </div>
    </li>
   )
}
export default Limenu;