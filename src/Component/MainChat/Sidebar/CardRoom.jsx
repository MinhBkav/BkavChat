import { useDispatch, useSelector } from "react-redux"
import { sRoom, sUser, getdataChat, isRead } from '../../../feature/userSlice'
import { setCheckScroll, setid } from '../../../feature/dataSlice'
import AvatarImage from "../../AvatarImage"
import { setInputMessage } from "../../../feature/dataSlice"
import { useState,useEffect } from "react"
import TimeDisplay from '../../../Hooks/TimeDisplay';
import { useNavigate, useParams } from "react-router-dom"
import { Truncate } from "../../../utils/Truncate"
export const CardRoom = ({ room }) => {
    const me = (() => {
        try { return JSON.parse(localStorage.getItem("me")) || {}; }
        catch { return {}; }
    })();
    const SS_KEYS = {
        id: "id",
        type: "type",
    }
    const navigate = useNavigate();
    const [read, setRead] = useState(false)
    const dispatch = useDispatch()
    const {type,id} = useParams();
    let isOnline
    const userOnline = useSelector(state => state.data.userOnline)
    const userid = useSelector(state => state.data.currentuserid)
    const rooms = useSelector(state=>(state.data.rooms))
    for (let i = 0; i < room.participants.length; i++) {
        if (userOnline.includes(room.participants[i].userId) && room.participants[i].userId != me.id) {
            isOnline = true;
            break;
        }
    }
    const loadChat = () => {
        dispatch(sUser(room))
        dispatch(sRoom({ type: "group" }))
        dispatch(setid(room._id))
        dispatch(setInputMessage(''))
        dispatch(getdataChat(room._id, null, 1))
        dispatch(setCheckScroll(false))
        sessionStorage.setItem(SS_KEYS.id, room._id);
        sessionStorage.setItem(SS_KEYS.type, "group");
        setRead(true)
        navigate(`/main-chat/group/${room._id}`);
    }
    useEffect(() => {
            if (type && id && rooms?.length) {
                if (type == "group") {
                    const found = rooms.find(r => r._id === id);
                    if (found)
                        loadChat()
                }
            }
        }, []);
    console.log(room.lastMessage)
    return (
        <>
            <button className={`${room._id === userid ? 'bg-slate-300 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-600 '}`} onClick={() => loadChat()}>
                <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]  ">
                    <div className=" flex justify-start  gap-2">
                        <AvatarImage src={room.avatarUrl} type="group" inputcss={"w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden"} isOnline={isOnline} />
                        <div className=" flex flex-col justify-center  ">
                            <h1 className="text-base text-start font-[500] dark:text-white">{room.name}</h1>
                            {room.lastMessage && (
                                !read && room.unreadCount != 0
                                    ? (<p className={`${room.lastMessage.unreadCount == 0 ? 'text-sm font-[400] dark:text-white text-start' : 'text-sm font-[700] text-start  dark:text-white'}`}>{Truncate(room.lastMessage.Content)}</p>
                                    ) : (<p className="text-sm font-[400] dark:text-white text-start">{Truncate(room.lastMessage.Content)}</p>))
                            }
                        </div>
                    </div>
                    {room.lastMessage && (<div className=" flex flex-col justify-center items-center gap-2 ">
                        <div className="w-full flex justify-end">
                            {(room.unreadCount != 0 && !read) && (
                                <h1 className=" text-xs   font-[700] rounded-full text-white   bg-red-500 px-[7px] py-[4px]">{room.unreadCount}</h1>
                            )}
                        </div>
                        <TimeDisplay isoString={room.lastMessage.CreatedAt} inputcss={"text-sm text-end font-[400] dark:text-white"} />
                    </div>)}
                </li>
            </button>
        </>
    )
}