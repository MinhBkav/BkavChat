import { useDispatch,useSelector} from "react-redux"
import {sUser} from '../../../feature/userSlice'
import { sInputsreach } from "../../../feature/sreachSlice"
import {setid} from '../../../feature/dataSlice'
export const CardSreach = ({user}) =>
{
    const dispatch = useDispatch()
    const loadChat =() =>
    {
        dispatch(sUser(user))
        dispatch(setid(user.id))
        dispatch(sInputsreach(''))
    }
    const userid = useSelector(state=>state.data.currentuserid)
    return   (
        <button className={`${user.id === userid?'bg-slate-300':'hover:bg-slate-100'}`} onClick={() => loadChat()}>
         <li className = " h-[72px] flex justify-between py-[0.3rem] px-[0.5rem]">
           <div className = " flex justify-start  gap-2">
                <img src={user.avatar} alt="Avatar" className = "w-[49px] h-[49px] object-cover rounded-full my-auto overflow-hidden" />
                <div className = " flex flex-col justify-center  ">
                        <h1 className = "text-base text-start font-[500]">{user.name}</h1>
                </div>
           </div>
        </li>

    </button>   
    )
}