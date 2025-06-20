import { useDispatch, useSelector } from "react-redux"
import { sUser } from '../../../feature/userSlice'
import {setid} from '../../../feature/dataSlice'
export const Cardfmobile = ({ user }) => {
    const dispatch = useDispatch()
    const loadChat = () => {
        dispatch(sUser(user))
        dispatch(setid(user.id))
    }
        const userid = useSelector(state=>state.data.currentuserid)

    return (
        <>
        <button className={`${user.id === userid?'bg-slate-300 dark:bg-slate-700':'hover:bg-slate-100 dark:hover:bg-slate-600 '}`} onClick={() => loadChat()}>
            <li className=" h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]  ">
                <div className=" flex justify-start  gap-2">
                    <img src={user.avatar} alt="Avatar" className="w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden" />
                </div>  
            </li>
        </button>
        </>
    )
}