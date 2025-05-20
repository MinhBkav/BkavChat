import { Cardfriend } from "./Cardfriend";
import {chatData} from './chatData'
export const Listuser = () =>
{
    
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