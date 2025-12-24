import { useDispatch, useSelector } from "react-redux"
import { sUser, getdataChat, isRead, sRoom } from '../../../feature/userSlice'
import { setCheckScroll, setid } from '../../../feature/dataSlice'
import AvatarImage from "../../AvatarImage"
import { addMessageData, setInputMessage } from "../../../feature/dataSlice"
import { useState, useEffect } from "react";
import TimeDisplay from '../../../Hooks/TimeDisplay';
import { useNavigate, useParams } from "react-router-dom"
import { Truncate } from "../../../utils/Truncate"
export const Cardfriend = ({ user }) => {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const [read, setRead] = useState(false)
    const dispatch = useDispatch()
    const isSend = user.isSend
    const CreatedAt = user.CreatedAt
    const FriendID = user.FriendID
    const UnreadCount = user.unreadCount
    const friends = useSelector(state => (state.data.chatData))
    const userid = useSelector(state => state.data.currentuserid)
    const SS_KEYS = {
        id: "id",
        type: "type",
    }
    let isOnline
    const userOnline = useSelector(state => state.data.userOnline)
    isOnline = userOnline.includes(user.FriendID);
    console.log(isOnline)
    const loadChat = () => {
        dispatch(sUser(user))
        dispatch(sRoom({ type: "solo" }))
        dispatch(setid(user.FriendID))
        dispatch(getdataChat(user.FriendID, null, 0))
        dispatch(setInputMessage(''))
        sessionStorage.setItem(SS_KEYS.id, String(user.FriendID));
        sessionStorage.setItem(SS_KEYS.type, "solo");
        dispatch(isRead({ FriendID: FriendID }))
        dispatch(setCheckScroll(false))
        setRead(true)
        navigate(`/main-chat/solo/${user.FriendID}`);
    }
    useEffect(() => {
        if (type && id && friends?.length) {
            if (type == "solo") {
                const found = friends.find(f => f.FriendID === id);
                if (found)
                    loadChat()
            }
        }
    }, []);
    return (
        <>
            <button className={`${user.FriendID === userid ? 'bg-slate-300 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-600 '}`} onClick={() => loadChat()}>
                <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]  ">
                    <div className=" flex justify-start  gap-2">
                        <AvatarImage src={user.Avatar} inputcss={"w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden"} type="solo" isOnline={isOnline} />
                        <div className=" flex flex-col justify-center  ">
                            <h1 className="text-base text-start font-[500] dark:text-white">{user.FullName}</h1>
                            {!read && UnreadCount != 0 ? (
                                <p className={`${isSend === 1 ? 'text-sm font-[400] dark:text-white text-start' : 'text-sm font-[700] text-start  dark:text-white'}`}>{Truncate(user.Content)}</p>
                            ) : (<p className="text-sm font-[400] dark:text-white text-start">{Truncate(user.Content)}</p>)}
                        </div>
                    </div>
                    <div className=" flex flex-col justify-center items-center gap-2 ">
                        <div className="w-full flex justify-end">
                            {(UnreadCount != 0 && !read) && (
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