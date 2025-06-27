import { useDispatch, useSelector } from "react-redux"
import { sUser,getdataChat,isRead} from '../../../feature/userSlice'
import {setid} from '../../../feature/dataSlice'
import AvatarImage from "../../AvatarImage"
import { addMessageData ,setInputMessage} from "../../../feature/dataSlice"
import { useState, useEffect } from "react"
export const Cardfriend = ({ user }) => {
    console.log(user)
    const [read,setRead] = useState(false)
    const dispatch = useDispatch()
    const isSend = user.isSend
    const CreatedAt = user.CreatedAt
    const FriendID = user.FriendID
    const UnreadCount = user.UnreadCount
    const loadChat = () => {
        dispatch(sUser(user))
        dispatch(setid(user.FriendID))
        dispatch(getdataChat(user.FriendID))
        dispatch(setInputMessage(''))
        dispatch(isRead({FriendID: FriendID,CreatedAt:CreatedAt }))
        setRead(true)
    }
        const userid = useSelector(state=>state.data.currentuserid)
    return (
        <>
        <button className={`${user.FriendID === userid?'bg-slate-300 dark:bg-slate-700':'hover:bg-slate-100 dark:hover:bg-slate-600 '}`} onClick={() => loadChat()}>
            <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]  ">
                <div className=" flex justify-start  gap-2">
                    <AvatarImage src={user.Avatar} inputcss={"w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden" } />
                    <div className=" flex flex-col justify-center  ">
                        <h1 className="text-base text-start font-[500] dark:text-white">{user.FullName}</h1>
                        {!read ?(
                                <p className={`${isSend === 1 ?'text-sm font-[400] dark:text-white text-start':'text-sm font-[700] text-start  dark:text-white'}`}>{user.Content}</p>
                        ):(  <p className="text-sm font-[400] dark:text-white text-start">{user.Content}</p>)}
                    </div>
                </div>
                <div className=" flex flex-col justify-center items-center gap-2 ">
                    <div className="w-full flex justify-end">
                    {(UnreadCount != 0 && !read) &&(
                        <h1 className=" text-xs   font-[700] rounded-full text-white   bg-red-500 px-[7px] py-[4px]">{UnreadCount}</h1>
                    )}
                    </div>
                    <p className="text-sm text-end font-[400] dark:text-white" >9:16 AM</p>
                </div>
            </li>
        </button>
        </>
    )
}