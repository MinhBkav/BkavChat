import {Listuser} from "./Listuser"
import {Search} from './Search'
export const Sidebar = () => {
    return (
        <>
        <aside className = "flex flex-col w-[360px] h-screen  border-r-2 border-slate-200 ">
            <Search/>
            <Listuser/>
        </aside>
        </>
    )
}
export default Sidebar;