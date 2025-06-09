import {Listuser} from "./Listuser"
import {Search} from './Search'
import {Listsreach} from './Listsreach'
import { useSelector, useDispatch } from 'react-redux'
export const Sidebar = () => {
    const inputsreach = useSelector((state) => state.sreach.inputSreach)
    return (
        <>
        <aside className = "fixed w-[360px] flex flex-col min-h-screen h-full  border-r-[1px] border-slate-200 ">
            <Search/>
            {inputsreach?<Listsreach/>:<Listuser/>}
        </aside>
        <aside className = "min-w-[360px] flex flex-col min-h-screen h-full  border-r-[1px] border-slate-950 " >
        </aside>
        </>
    )
}
export default Sidebar;