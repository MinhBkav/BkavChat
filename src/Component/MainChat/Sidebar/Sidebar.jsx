import {Listuser} from "./Listuser"
import {Search} from './Search'
import {Listsreach} from './Listsreach'
import { useSelector, useDispatch } from 'react-redux'
import {setOpenSidebar} from '../../../feature/dataSlice'

export const Sidebar = () => {
  const dispatch = useDispatch();
    const inputsreach = useSelector((state) => state.sreach.inputSreach)
    const openSidebar = useSelector((state) => state.data.openSidebar)
    console.log(openSidebar);
    
    return (
        <>
        <aside className = {`fixed ${openSidebar ? "w-[360px]" : "md:w-[360px] w-[60px]"}   flex flex-col min-h-screen h-full  border-r-[1px] dark:border-slate-600 border-slate-200 dark:bg-[#171717] `} onMouseEnter={()=>dispatch(setOpenSidebar(true))} onMouseLeave={()=>dispatch(setOpenSidebar(false))}>
            <Search/>
            {inputsreach?<Listsreach/>:<Listuser/>}
        </aside>
        <aside className = {` ${openSidebar ? "w-[360px]" : "md:w-[360px] w-[60px]"}  flex flex-col min-h-screen h-full  border-r-[1px] dark:border-slate-600 border-slate-200 dark:bg-[#171717] `}  >
        </aside>
        </>
    )
}
export default Sidebar;