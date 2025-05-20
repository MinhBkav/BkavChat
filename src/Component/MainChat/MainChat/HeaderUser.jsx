import {chatData} from '../Sidebar/chatData'
export const HeaderUser = () =>
{
    const user = chatData[0]
return (
       <>
       <div className = "fixed h-[60px]">
       <div className = "relative flex  py-[6.5px]">
             <div className = " flex justify-start  gap-2 pl-[8px]">
                <img src={user.avatar} alt="Avatar" className = "w-10 h-10 object-cover rounded-full my-auto overflow-hidden" />
                <div className = " flex flex-col justify-center gap-[3px]  ">
                        <h1 className = "text-base font-[500]">{user.name}</h1>
                        <p className = "text-sm font-[400] text-[#747881] ">Online for 10 mins</p>
                </div>
           </div>

       </div>
       </div>
       <div className = "w-[1550px] h-[60px]"></div>
        </>
    )
}
export default HeaderUser;