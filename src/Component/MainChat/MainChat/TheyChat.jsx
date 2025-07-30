import { useState,lazy,Suspense } from 'react';
import {Timehover} from '../../Timehover';
import {useDispatch} from "react-redux";
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { setMessageReply } from '../../../feature/userSlice';
const emotion = ["❤️", "👍", "👎", "😂", "😮", "😞"];
const Emotion = lazy(()=>import('./Emotion'))
const WindowMessage = lazy(()=>import( './WindowMessage'))
export const TheyChat = ({ mes }) => {
   const isLong = mes.Content.length > 2
   const [showEmotion, setShowEmotion] = useState(false)
    const [showInteract, setShowInteract] = useState(false)
    const messageId = useSelector(state => state.user.messageId)
    const [previewImage, setPreviewImage] = useState(null);

    const close = () => {
        setModal(false)
    }
    const [modal, setModal] = useState(false)
    const { hanlderEnter: enter2, hanlderLeave: leave2 } = Timehover(setShowEmotion,close,100)
    const { hanlderEnter: enter1, hanlderLeave: leave1 } = Timehover(setShowInteract,close,500)
    const replyRef = useRef(null);
    const [replyRect, setReplyRect] = useState({ height: 0, width: 0 });
    const dispatch = useDispatch();
    useEffect(() => {
        if (!replyRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const { height, width } = entry.contentRect;
            setReplyRect({ height, width });
        });

        observer.observe(replyRef.current);

        return () => observer.disconnect();
    }, [mes.MessageReply]);

    const refMain = useRef(null);

    const handleReply = () => {
        return new Promise((resolve) => {
            if (!refMain.current) return resolve(null);
            const rect = refMain.current.getBoundingClientRect();
            const size = { height: rect.height, width: rect.width };

            dispatch(setMessageReply({ id: mes.id, whmessMain: size }));

            resolve(size); // 👈 gửi lại cho con
        });
    };
   return (
      <>

          <div className={`relative flex gap-[11px] justify-start ${mes.id == messageId ? 'z-30' : 'z-10'}  ${mes.Emotion ? 'mb-3':''}`} style={{ marginTop: replyRect.height }}>
          {mes.MessageReply && (
              <>
                  <div ref={replyRef}
                       className={`absolute left-0 bottom-6   bg-[#8a8b8b] dark:bg-blue-600  dark:text-white max-w-[262px]   ${(isLong || mes.Images.length > 0) ? "rounded-r-2xl rounded-tl-2xl" : "rounded-r-full rounded-tl-full"} `} onMouseEnter={enter1} onMouseLeave={leave1}
                       style={{
                           width: `${mes.MessageReply.whmessMain?.width || 0}px`,
                           height: `${mes.MessageReply.whmessMain?.height || 0}px`
                       }}
                  >
                      {mes.MessageReply.Images && (
                          <img
                              src={`http://30.30.30.12:8080/api${mes.MessageReply.Images.urlImage}`}
                              alt={mes.MessageReply.Images.FileName}
                              className="w-[258px] max-h-[150px] object-cover rounded-2xl mx-[2px] pt-[2px] z-0"
                          />
                      )}
                      {mes.MessageReply.Files && (
                          <>
                              <div className=" flex  py-[4px] px-[15px]">
                                  <a
                                      href={`http://30.30.30.12:8080/api${mes.MessageReply.Files.urlFile}`} // <-- cần domain backend
                                      download={mes.MessageReply.Files.FileName}                        // <-- kích hoạt tải file
                                      target="_blank"                                 // mở tab mới nếu click
                                      rel="noopener noreferrer"
                                      className="text-blue-600 underline block  hover:text-blue-800 "
                                  >
                                      <ion-icon name="document-outline" className="text-blue-500 " />
                                  </a>
                                  <p>{mes.MessageReply.Files.FileName}</p>
                              </div>
                          </>
                      )}
                      {mes.MessageReply.Content && (<p className=" py-[4px] px-[15px]">{mes.MessageReply.Content}</p>)}
                  </div>
                  {/*<div className = "absolute z-10 bg-slate-700 opacity-70 bottom-6  w-full  h-8 rounded-l-full rounded-tr-full" style={{ height : replyRect.height , width : replyRect.width }}></div>*/}
              </>
          )}
              {mes.Emotion && (<div className = "absolute left-0 top-6  z-30">{emotion[mes.Emotion]}</div>)}
              <div className={`bg-[#E9EAED] dark:bg-slate-600 dark:text-white max-w-[262px] z-20 ${(isLong|| mes.Images.length > 0 )? "rounded-r-2xl rounded-tl-2xl" : "rounded-r-full rounded-tl-full"} `} onMouseEnter={enter1} onMouseLeave={leave1}
         ref = {refMain}
         >
             {mes.Images?.length > 0 && (
                 <div className={`grid gap-[4px] ${mes.Images.length > 3 ? "grid-cols-3" : `w-[262px] `} px-[2px] pt-[2px]`}>
                     {mes.Images.map((img, index) => (
                         <img
                             key={index}
                             src={`http://30.30.30.12:8080/api${img.urlImage}`}
                             alt={img.FileName}
                             onClick={() => setPreviewImage(`http://30.30.30.12:8080/api${img.urlImage}`)}
                             className="w-full  object-cover rounded-lg cursor-pointer hover:opacity-80 bg-gray-400"
                         />

                     ))}
                 </div>
             )}
             {mes.Files?.map((file, index) => (
                            <>
                             <div className = "flex py-[4px] px-[15px]">
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
                           {  mes.Content && (<p className="py-[4px] px-[15px] ">{mes.Content}</p>)}
         </div>

          {showInteract && (<div className=" flex w-[68px] items-center " onMouseEnter={enter1} onMouseLeave={leave1}>
            <button className="relative flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onMouseEnter={enter2} onMouseLeave={leave2} ><ion-icon name="happy-outline" className="w-[20px] h-[20px] dark:text-[#9c9f9f] border-gray-700 rounded-full focus:text-sky-600 " ></ion-icon></button>
                    <Emotion showEmotion={showEmotion} positionE={"right"} hanlderEnter={enter2} hanlderLeave={leave2} mes = {mes} />
            <button className="flex-1 z-10 flex items-center justify-center focus:text-sky-600 " onClick={() => setModal(!modal)} ><ion-icon name="ellipsis-vertical" className="w-[20px] h-[20px]  border-gray-700 rounded-full dark:text-[#9c9f9f] focus:text-sky-600 " ></ion-icon></button>
            <WindowMessage openModal={modal} positionE={"left"} close={close} mes = {mes} onReply = {handleReply}/>
         </div>)}
      </div>
          {previewImage && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                  onClick={() => setPreviewImage(null)}
              >
                  <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                  />
                  <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-4 right-4 text-white text-3xl font-bold"
                  >
                      &times;
                  </button>
              </div>
          )}
      </>
   )
}