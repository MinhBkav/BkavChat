import { Cardfriend } from "./Cardfriend";
import { useSelector } from "react-redux";
export const Listuser = () =>
{
    const chatData = useSelector(state=>(state.data.chatData))
    return (
       <>
       <div className = "  ">
        <ul className = "flex flex-col ">
         {chatData.map(user => (
        <Cardfriend key={user.id} user={user} />
            ))} 
       </ul>
       </div>
       </>
    )
}
export default Listuser;