
import { chatData } from './chatData'
import { Limenu } from './Limenu'
import { Checkbox } from './Checkbox'
import { useRef } from 'react'
import { useClickOutside } from '../../../Hooks/useClickOutside'
import { useTheme } from '../../../Hooks/toggleTheme';
import { Logout } from './Logout'
import { useDispatch, useSelector } from 'react-redux'
import AvatarImage from '../../AvatarImage'
import { setOpenCreateRoom, setOpenMyInfo } from '../../../feature/dataSlice'

const WindowSetting = ({ openModal, close }) => {
    const openCreatRoom = useSelector(state=>state.data.openCreatRoom)
    const { toggleTheme } = useTheme()
    const ref = useRef(null)
    const listUser = useSelector(state => state.data.chatData)
    const dispatch = useDispatch()
    console.log(openCreatRoom)
    const me = JSON.parse(localStorage.getItem("me"));
    console.log(me)
    console.log(me.Username)
    useClickOutside(ref, close, openModal&&!openCreatRoom)
    if (!openModal)
        return null;
    return (
        <>
            <div className="fixed z-30 left-[11px] top-[54px]  " ref={ref}>
                <div className="w-[295px] h-[350px] flex flex-col rounded-2xl shadow-2xl  overflow-hidden bg-white dark:bg-slate-600 ">
                    <div className="flex-1 ">
                        <div className="w-full h-[36px] flex justify-start gap-[10px] mt-[10px] ml-[10px]">
                            <AvatarImage src={me.Avatar} inputcss={"w-[36px] h-[36px] rounded-full"} />
                            <h1 className="font-[500] text-xl flex items-center dark:text-white">{me.FullName}</h1>
                        </div>
                    </div>
                    <button className="flex-1 hover:bg-[#DBDDE1] dark:hover:bg-slate-700" onClick ={()=>dispatch(setOpenMyInfo(true))}>
                        <div className="flex justify-between  m-4">
                            <div className="flex justify-between items-center gap-4  ">
                                <ion-icon name="person-outline" className="w-[24px] h-[24px] text-[#747881] "></ion-icon>
                                <h2 className="font-[500] text-base dark:text-white">Thông tin</h2>
                            </div>
                            <div className="rounded-full text-white font-[700] text-xs  w-[22px] h-[22px] flex items-center justify-center" ></div>
                        </div>
                    </button>
                    <Limenu icon="at-outline" text="Nhắc đến bạn" inputcss="rounded-full text-white font-[700] text-xs bg-[#747881] w-[22px] h-[22px] flex items-center justify-center" action={1} />
                    <button className="flex-1 hover:bg-[#DBDDE1] dark:hover:bg-slate-700" onClick ={()=>dispatch(setOpenCreateRoom(true))}>
                        <div className="flex justify-between  m-4">
                            <div className="flex justify-between items-center gap-4  ">
                                <ion-icon name="people-outline" className="w-[24px] h-[24px] text-[#747881] "></ion-icon>
                                <h2 className="font-[500] text-base dark:text-white">Tạo nhóm</h2>
                            </div>
                            <div className="rounded-full text-white font-[700] text-xs  w-[22px] h-[22px] flex items-center justify-center" ></div>
                        </div>
                    </button>
                    <Limenu icon="moon-outline" text="Theme" inputcss="rounded-full text-white font-[700] text-xs  w-[44px] h-[22px] flex items-center justify-center" action={<Checkbox toggleTheme={toggleTheme} />} />
                    <Logout />
                </div>
            </div>
           
        </>
    )
}
export default WindowSetting;