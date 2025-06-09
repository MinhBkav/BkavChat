import { useState, useEffect } from 'react'
import { WindowSetting } from './WindowSetting'
import Listuser from './Listuser'
import { CardSreach } from './CardSreach'
import { useSelector, useDispatch } from 'react-redux'
import { sInputsreach } from '../../../feature/sreachSlice'
export const Listsreach = () =>
{
      const sreach = useSelector((state) => state.sreach.dataSreach)
      const inputsreach = useSelector((state) => state.sreach.inputSreach)
      const filteredUsers = inputsreach
         ? sreach.filter(user =>
            user.name.toLowerCase().startsWith(inputsreach.toLowerCase())
        )
       : []
    return (
                    <>
                        <div className="fixed w-[360px] mt-[60px] h-full bg-white border-r-[1px] border-slate-200">
                            <div className="h-[56px] border-b-[1px] border-slate-150">
                                <p className="py-[18px] pl-[16px]">{filteredUsers?.length} results</p>
                            </div>
                            <ul className="flex flex-col ">
                                {filteredUsers?.map(user => (
                                    <CardSreach key={user.id} user={user} />
                                ))}
                            </ul>
                        </div>
                    </>
    )
}
export default Listsreach;