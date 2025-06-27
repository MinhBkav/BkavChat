import {chatData} from '../Sidebar/chatData'
import { useSelector } from 'react-redux'
import AvatarImage from '../../AvatarImage'
export const HeaderUser = () =>
{
    const user = useSelector(state=>state.user.userChat)
return (
       <>
       <div className = " h-[60px] w-full  bg-white dark:bg-[#171717]  ">
       <div className = "relative flex  py-[6.5px]">
             <div className = " flex justify-start  gap-2 pl-[8px]">
                <AvatarImage src={user.Avatar} inputcss={"w-10 h-10 object-cover rounded-full my-auto overflow-hidden" } />
                <div className = " flex flex-col justify-center gap-[3px]  ">
                        <h1 className = "text-base font-[500] dark:text-white">{user.Username}</h1>
                        <p className = "text-sm font-[400] text-[#747881] dark:text-[#9c9f9f] ">Online for 10 mins</p>
                </div>
           </div>
       </div>
       </div>
        </>
    )
}
export default HeaderUser;