import { useState,lazy,Suspense } from 'react';
import { Timehover } from '../../Timehover';
const Emotion = lazy(()=>import('./Emotion'))
const WindowMessage = lazy(()=>import( './WindowMessage'))
export const MeChat = ({ mes }) => {
    const isLong = mes.Content.length > 2
    const [showEmotion, setShowEmotion] = useState(false)
    const [showInteract, setShowInteract] = useState(false)
    console.log(mes)
    const close = () => {
        setModal(false)
    }
    const [modal, setModal] = useState(false)
    const { hanlderEnter: enter2, hanlderLeave: leave2 } = Timehover(setShowEmotion,close,100)
    const { hanlderEnter: enter1, hanlderLeave: leave1 } = Timehover(setShowInteract,close,100)

    return (
        <>
            <div className="relative flex gap-[11px] justify-end" >
                {showInteract && (<div className=" flex w-[68px] items-center " onMouseEnter={enter1} onMouseLeave={leave1}>
                    <button className=" flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() => setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full dark:text-[#9c9f9f] focus:text-sky-600 " ></ion-icon></button>
                    <Emotion showEmotion={showEmotion} positionE={"left"} hanlderEnter={enter2} hanlderLeave={leave2} />
                    <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onMouseEnter={enter2} onMouseLeave={leave2}  ><ion-icon name="happy-outline" className="w-[20px] h-[20px]  border-gray-700 dark:text-[#9c9f9f] rounded-full focus:text-sky-600 " ></ion-icon></button>
                    <WindowMessage openModal={modal} positionE={"right"} close={close}  />
                </div>)}
                <div className={` bg-[#E0F0FF] dark:bg-blue-600 dark:text-white max-w-[262px] ${(isLong || mes.Images.length > 0) ? "rounded-l-2xl rounded-tr-2xl" : "rounded-l-full rounded-tr-full"} `} onMouseEnter={enter1} onMouseLeave={leave1}>
                    {mes.Images?.map((img, index) => (
                        <img
                            key={index}
                            src={`http://30.30.30.12:8080/api${img.urlImage}`}
                            alt={img.FileName}
                            className="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px]"
                        />
                    ))}
                    {mes.Files?.map((file, index) => (
                        <>
                            <div className="flex py-[4px] px-[15px]">
                                <a
                                    key={index}
                                    href={`http://30.30.30.12:8080/api${file.urlFile}`} // <-- cần domain backend
                                    download={file.FileName}                        // <-- kích hoạt tải file
                                    target="_blank"                                 // mở tab mới nếu click
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline block  hover:text-blue-800 "
                                >
                                    <ion-icon name="document-outline" className="text-blue-500 " />
                                </a>
                                <p>{file.FileName}</p>
                            </div>
                        </>
                    ))}
                    {mes.Content && (<p className="py-[4px] px-[15px] ">{mes.Content}</p>)}
                </div>
            </div>
        </>
    )
}