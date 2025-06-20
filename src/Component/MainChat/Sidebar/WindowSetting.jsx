
import { chatData } from './chatData'
import { Limenu } from './Limenu'
import { Checkbox } from './Checkbox'
import { useRef } from 'react'
import { useClickOutside } from '../../../Hooks/useClickOutside'
import { useTheme } from '../../../Hooks/toggleTheme';
import { Logout } from './Logout'

export const WindowSetting = ({ openModal, close }) => {
    const { toggleTheme } = useTheme()
    const ref = useRef(null)
    useClickOutside(ref, close, openModal)
    if (!openModal)
        return null;
    const data = chatData[0]
    return (
        <div className="fixed z-30 left-[11px] top-[54px]  " ref={ref}>
            <ul className="w-[295px] h-[280px] flex flex-col rounded-2xl shadow-2xl  overflow-hidden bg-white dark:bg-slate-600 ">
                <li className="flex-1 ">
                    <div className="w-full h-[36px] flex justify-start gap-[10px] mt-[10px] ml-[10px]">
                        <img src={data.avatar} alt="avatar" className="w-[36px] h-[36px] rounded-full" />
                        <h1 className="font-[500] text-xl flex items-center dark:text-white">{data.name}</h1>
                    </div>
                </li>
                <Limenu icon="at-outline" text="Nhắc đến bạn" inputcss="rounded-full text-white font-[700] text-xs bg-[#747881] w-[22px] h-[22px] flex items-center justify-center" action={1} />
                <Limenu icon="people-outline" text="Tạo nhóm" inputcss="rounded-full text-white font-[700] text-xs  w-[22px] h-[22px] flex items-center justify-center" action={""} />
                <Limenu icon="moon-outline" text="Theme" inputcss="rounded-full text-white font-[700] text-xs  w-[44px] h-[22px] flex items-center justify-center" action={<Checkbox toggleTheme={toggleTheme} />} />
                <Logout/>
            </ul>
        </div>
    )
}