import { chatData } from '../Sidebar/chatData'
import { useSelector } from 'react-redux'
import AvatarImage from '../../AvatarImage'
import moment from 'moment'
import { FormatTime } from '../../../utils/FormatTime'
export const HeaderUser = () => {
  const user = useSelector(state => state.user.userChat)
  let type = "solo"
  let src
  let isOnline
  let statusText
  let name
  const userOnline = useSelector(state => state.data.userOnline)
    type = user.FriendID ? "solo" : "group"
    src = user.FriendID  ? user.Avatar : user.avatarUrl
  console.log(user.FriendID)
    isOnline = userOnline.includes(user.FriendID);
    statusText = FormatTime(user.UpdateAtUser, isOnline)
    name = user.FullName|| user.name
  console.log(isOnline)

  return (
    <>
      <div className=" h-[60px] w-full  bg-white dark:bg-[#171717]  ">
        <div className="relative flex  py-[6.5px]">
          <div className=" flex justify-start  gap-2 pl-[8px]">
            <AvatarImage src={src} inputcss={"w-10 h-10 object-cover rounded-full my-auto overflow-hidden"} isOnline={isOnline} type = {type} />
            <div className=" flex flex-col justify-center gap-[3px]  ">
              <h1 className="text-base font-[500] dark:text-white">{name}</h1>
              <p className="text-sm font-[400] text-[#747881] dark:text-[#9c9f9f] ">  {isOnline ? "Active now" : ` ${statusText} `}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HeaderUser;