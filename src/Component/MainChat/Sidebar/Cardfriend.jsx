import { useDispatch, useSelector } from "react-redux"
import {sUser, getdataChat, isRead, sRoom} from '../../../feature/userSlice'
import {setCheckScroll, setid} from '../../../feature/dataSlice'
import AvatarImage from "../../AvatarImage"
import { addMessageData ,setInputMessage} from "../../../feature/dataSlice"
import { useState, useEffect } from "react"
import TimeDisplay from '../../../Hooks/TimeDisplay';
export const Cardfriend = ({ user }) => {
    const [read,setRead] = useState(false)
    const dispatch = useDispatch()
    const isSend = user.isSend
    const CreatedAt = user.CreatedAt
    const FriendID = user.FriendID
    const UnreadCount = user.unreadCount
    const truncate = (str, maxLength = 15) => {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}
     let isOnline
     const userOnline = useSelector(state => state.data.userOnline)
    isOnline = userOnline.includes(user.FriendID);
     console.log(isOnline)
       const loadChat = () => {
        dispatch(sUser(user))
        dispatch(sRoom({type : "solo"}))
        dispatch(setid(user.FriendID))
        console.log(user.FriendID)
        dispatch(getdataChat(user.FriendID,null,0))
        console.log("idddddddddđ",user.FriendID)
        dispatch(setInputMessage(''))
        dispatch(isRead({FriendID: FriendID}))
        dispatch(setCheckScroll(false))
        setRead(true)
    }
        const userid = useSelector(state=>state.data.currentuserid)
    return (
        <>
        <button className={`${user.FriendID === userid?'bg-slate-300 dark:bg-slate-700':'hover:bg-slate-100 dark:hover:bg-slate-600 '}`} onClick={() => loadChat()}>
            <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]  ">
                <div className=" flex justify-start  gap-2">
                    <AvatarImage src={user.Avatar} inputcss={"w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden" } type = "solo" isOnline={isOnline}/>
                    <div className=" flex flex-col justify-center  ">
                        <h1 className="text-base text-start font-[500] dark:text-white">{user.FullName}</h1>
                        {!read&&UnreadCount !=0 ?(
                                <p className={`${isSend === 1 ?'text-sm font-[400] dark:text-white text-start':'text-sm font-[700] text-start  dark:text-white'}`}>{truncate(user.Content)}</p>
                        ):(  <p className="text-sm font-[400] dark:text-white text-start">{truncate(user.Content)}</p>)}
                    </div>
                </div>
                <div className=" flex flex-col justify-center items-center gap-2 ">
                    <div className="w-full flex justify-end">
                    {(UnreadCount != 0 && !read) &&(
                        <h1 className=" text-xs   font-[700] rounded-full text-white   bg-red-500 px-[7px] py-[4px]">{UnreadCount}</h1>
                    )}
                    </div>
                    <TimeDisplay isoString={user.CreatedAt} inputcss={"text-sm text-end font-[400] dark:text-white"} />
                </div>
            </li>
        </button>
        </>
    )
}