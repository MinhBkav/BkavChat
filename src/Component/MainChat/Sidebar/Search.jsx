import { useState, useEffect } from 'react'
import { WindowSetting } from './WindowSetting'
import Listuser from './Listuser'
import { CardSreach } from './CardSreach'
import { useSelector, useDispatch } from 'react-redux'
import { sInputsreach } from '../../../feature/sreachSlice'
export const Search = () => {
    const [modal, setModal] = useState(false)
    const dispatch = useDispatch()
    const inputsreach = useSelector((state) => state.sreach.inputSreach)
    const onChange = (e) => {
        dispatch(sInputsreach(e.target.value))
    }
    const clearInput = () =>
    {
        dispatch(sInputsreach(''))
    }
    const close = () => {
        setModal(false)
    }
    // let filteredUsers=[];
    // useEffect(()=>{
    //     const time = setTimeout(()=>{
    //           filteredUsers = inputsreach
    //      ? sreach.filter(user =>
    //         user.name.toLowerCase().startsWith(inputsreach.toLowerCase())
    //     )
    //    : []
    //     },1000)
    //     return ()=>clearTimeout(time)
    // },[sreach]) 
return (
    <>
        <div className="absolute  w-full h-[60px] bg-white dark:bg-[#171717]  dark: border-r-[1px] border-slate-200 top-0 md:flex flex-col justify-center  ">
            <div className="relative flex  py-2">
                {!inputsreach && (<button onClick={() => setModal(!modal)} className="z-20"><ion-icon name="menu-sharp" className="w-8 h-8 mx-4 dark:text-blue-600"></ion-icon></button>)}
                {inputsreach && (<button className="z-20"><ion-icon name="arrow-back-sharp" className="w-8 h-8 mx-4 dark:text-blue-600"></ion-icon></button>)}
                <WindowSetting openModal={modal} close = {close}/>
                <input
                    type="text"
                    value={inputsreach}
                    placeholder="Tìm kiếm"
                    onChange={onChange}
                    className="rounded-full  w-[78%]  text-lg ring-2 ring-slate-300 dark:ring-slate-600 pl-12 py-[6px] focus:ring-[#5787db] outline-none dark:bg-slate-600 dark:text-white "
                />

                <ion-icon
                    name="search-sharp"
                    class="absolute  top-1/2 -translate-y-1/2 text-xl pl-20 font-[700] dark:text-blue-400" ></ion-icon>
                {inputsreach && (<ion-icon
                    name="close-sharp"
                    class="absolute  top-1/2 -translate-y-1/2  text-gray-400 text-2xl right-6 font-[700]" onClick={() => clearInput()}></ion-icon>)}
            </div>
        </div>
        <div className="w-100% h-[60px] "></div>
       
    </>
)
}
export default Search;