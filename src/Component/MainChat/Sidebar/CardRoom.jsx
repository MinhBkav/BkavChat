import { useDispatch, useSelector } from "react-redux"
import { sRoom,sUser,getdataChat,isRead} from '../../../feature/userSlice'
import {setCheckScroll, setid} from '../../../feature/dataSlice'
import AvatarImage from "../../AvatarImage"
import { setInputMessage} from "../../../feature/dataSlice"
import { useState } from "react"
import TimeDisplay from '../../../Hooks/TimeDisplay';
export const CardRoom = ({ room }) => {
    console.log(room)
    const [read,setRead] = useState(false)
    const dispatch = useDispatch()
    const truncate = (str, maxLength = 15) => {
        if (!str) return ''
        return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
    }

    const loadChat = () => {
        dispatch(sUser(room))
        dispatch(setid(room._id))
        dispatch(setInputMessage(''))
        dispatch(getdataChat(room._id,null,1))
        dispatch(setCheckScroll(false))
        setRead(true)
    }
    const userid = useSelector(state=>state.data.currentuserid)
    return (
        <>
            <button className={`${room._id === userid?'bg-slate-300 dark:bg-slate-700':'hover:bg-slate-100 dark:hover:bg-slate-600 '}`} onClick={() => loadChat()}>
                <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]  ">
                    <div className=" flex justify-start  gap-2">
                        <AvatarImage src={room.avatarUrl} inputcss={"w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden" } type = {"group"} />
                        <div className=" flex flex-col justify-center  ">
                            <h1 className="text-base text-start font-[500] dark:text-white">{room.name}</h1>
                        </div>
                    </div>
                    <div className=" flex flex-col justify-center items-center gap-2 ">
                    </div>
                </li>
            </button>
        </>
    )
}