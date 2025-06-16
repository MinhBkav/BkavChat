import {Listuser} from "./Listuser"
import {Search} from './Search'
import {Listsreach} from './Listsreach'
import { useSelector, useDispatch } from 'react-redux'
export const Sidebar = () => {
    const inputsreach = useSelector((state) => state.sreach.inputSreach)
    return (
        <>
        <aside className = "fixed w-[360px] md:flex flex-col min-h-screen h-full  border-r-[1px] dark:border-slate-600 border-slate-200 dark:bg-[#171717] hidden">
            <Search/>
            {inputsreach?<Listsreach/>:<Listuser/>}
        </aside>
        <aside className = "min-w-[360px] md:flex flex-col min-h-screen h-full  border-r-[1px] border-slate-950 hidden" >
        </aside>
        <aside className = "fixed w-[60px] flex flex-col min-h-screen h-full  border-r-[1px] dark:border-slate-600 border-slate-200 dark:bg-[#171717] md:hidden">
            <Search/>
            <Listuser/>
        </aside>
        <aside className = "min-w-[60px] flex flex-col min-h-screen h-full  border-r-[1px] border-slate-950 md:hidden" >
        </aside>
        </>
    )
}
export default Sidebar;