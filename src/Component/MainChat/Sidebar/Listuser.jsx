import { Cardfriend } from "./Cardfriend";
import { useSelector ,useDispatch} from "react-redux";
import { Cardfmobile } from "./Cardfmobile";
export const Listuser = () =>
{
    const chatData = useSelector(state=>(state.data.chatData))
    const dispatch = useDispatch();
    const openSidebar = useSelector((state) => state.data.openSidebar)
    return (
       <>
       <div className = "  ">
        <ul className = { `${openSidebar ? "flex flex-col" : "md:flex flex-col hidden"}`}>
         {chatData.map(user => (
        <Cardfriend key={user.id} user={user} />
            ))} 
       </ul>
        <ul className = { `${openSidebar ? "hidden" : "flex flex-col md:hidden"}`}>
         {chatData.map(user => (
        <Cardfmobile key={user.id} user={user} />
            ))} 
       </ul>
       </div>
       </>
    )
}
export default Listuser;