import { useNavigate } from "react-router-dom";
import { logout } from '../../../feature/loginSlice'
import { useDispatch } from "react-redux";
export const Logout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const removeToken = () => {
         localStorage.setItem("token", "");
         navigate("/login")
         dispatch(logout())
    }
    return (
     <li className="flex-1 hover:bg-[#DBDDE1] dark:hover:bg-slate-700">
        <button onClick={()=>removeToken()}>
            <div className="flex justify-between  m-4">
                <div className="flex justify-between items-center gap-4  ">
                    <ion-icon name="person-outline" className="w-[24px] h-[24px] text-[#747881] "></ion-icon>
                    <h2 className="font-[500] text-base dark:text-white">Đăng xuất</h2>
                </div>
                <div className="rounded-full font-[700] text-xs  w-[22px] h-[22px] flex items-center justify-center"></div>
            </div>
        </button>
        </li>
    )
}