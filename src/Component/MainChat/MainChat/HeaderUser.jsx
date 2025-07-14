import {chatData} from '../Sidebar/chatData'
import { useSelector } from 'react-redux'
import AvatarImage from '../../AvatarImage'
import moment from 'moment'
export const HeaderUser = () =>
{
    const user = useSelector(state=>state.user.userChat)
    const userOnline = useSelector(state=>state.data.userOnline)
    const isOnline = userOnline.includes(user.FriendID);
    console.log(isOnline)
const lastOnline = moment(user.UpdateAtUser);
const now = moment();
const diffMinutes = now.diff(lastOnline, 'minutes');
const diffHours = now.diff(lastOnline, 'hours');

let statusText = "Unknown";

if (isOnline) {
  statusText = "Active now";
} else if (diffMinutes < 60) {
  statusText = `Online ${diffMinutes} min ago`;
} else if (diffHours < 24) {
  statusText = `Online ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
} else {
  statusText = `Online at ${lastOnline.format("DD/MM/YYYY ")}`;
}
    console.log(user.UpdateAtUser)
return (
       <>
       <div className = " h-[60px] w-full  bg-white dark:bg-[#171717]  ">
       <div className = "relative flex  py-[6.5px]">
             <div className = " flex justify-start  gap-2 pl-[8px]">
                <AvatarImage src={user.Avatar} inputcss={"w-10 h-10 object-cover rounded-full my-auto overflow-hidden" } isOnline={isOnline}/>
                <div className = " flex flex-col justify-center gap-[3px]  ">
                        <h1 className = "text-base font-[500] dark:text-white">{user.FullName}</h1>
                        <p className = "text-sm font-[400] text-[#747881] dark:text-[#9c9f9f] ">  {isOnline ? "Active now" : ` ${statusText} `}</p>
                </div>
           </div>
       </div>
       </div>
        </>
    )
}
export default HeaderUser;