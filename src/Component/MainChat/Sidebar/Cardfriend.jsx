import { useDispatch, useSelector } from "react-redux"
import { sUser } from '../../../feature/userSlice'
import {setid} from '../../../feature/dataSlice'
export const Cardfriend = ({ user }) => {
    const dispatch = useDispatch()
    const loadChat = () => {
        dispatch(sUser(user))
        dispatch(setid(user.id))
    }
        const userid = useSelector(state=>state.data.currentuserid)
        console.log("day la ",userid);

    return (
        <button className={`${user.id === userid?'bg-slate-300':'hover:bg-slate-100'}`} onClick={() => loadChat()}>
            <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem] ">
                <div className=" flex justify-start  gap-2">
                    <img src={user.avatar} alt="Avatar" className="w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden" />
                    <div className=" flex flex-col justify-center  ">
                        <h1 className="text-base text-start font-[500]">{user.name}</h1>
                        <p className="text-sm font-[400] ">{user.messages[1].text}</p>
                    </div>
                </div>
                <div className=" flex flex-col justify-center items-center gap-2 ">
                    <div className="w-full flex justify-end">
                        <h1 className=" text-xs   font-[700] rounded-full text-white  bg-red-500 px-[7px] py-[4px]">80</h1>
                    </div>
                    <p className="text-sm text-end font-[400]" >9:16 AM</p>
                </div>
            </li>
        </button>
    )
}