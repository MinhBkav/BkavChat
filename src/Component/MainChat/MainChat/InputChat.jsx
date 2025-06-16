import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addMessage } from "../../../feature/userSlice"
import { addMessageData } from "../../../feature/dataSlice"
export const InputChat = () => {
      const dispatch = useDispatch()
      const userid = useSelector(state => state.data.currentuserid)
      const [inputMessage, setInputMessage] = useState('')
      const send = () => {
            dispatch(addMessage({ sender: "me", text: inputMessage, id: 10, time: "01:20 AM", image: "./images/Apple.png" }))
            dispatch(addMessageData({message:{ sender: "me", text: inputMessage, id: 10, time: "01:20 AM", image: "./images/Apple.png"},userid:userid }))
            console.log(userid);
      }
      return (
            <>
                  <div className="fixed md:w-[calc(100vw-361px)] w-[calc(100vw-61px)] h-[56px] bottom-0 flex flex-col justify-center items-center bg-white dark:bg-[#171717]">
                        <div className="relative w-[98.97%] flex justify-between mx-[0.3145rem] my-2">
                              <div className=" flex justify-center items-center">
                                    <ion-icon name="add-circle-outline" className="w-[1.8rem] h-[1.8rem] dark:text-blue-600"></ion-icon>
                              </div>
                              <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn"
                                    className="rounded-full  w-[94.296%] m-auto h-[40px] pl-4 text-lg ring-1 dark:text-white ring-slate-300 dark:ring-slate-600 outline-none focus:border   dark:bg-slate-600 "
                              />
                              <ion-icon
                                    name="happy-outline"
                                    class="w-8 h-8 absolute  top-1/2 -translate-y-1/2 text-gray-400 dark:text-blue-500 text-xl right-14 " ></ion-icon>
                              <div className="flex justify-center items-center m-auto  ">
                                    <button onClick={() => send()} className = ""><ion-icon name="send-sharp" className="w-[1.5em] h-[1.5em]  bg-slate-400 dark:bg-blue-600 py-[0.65rem] pl-[0.7rem] pr-[0.5rem] rounded-full text-white dark:text-[#171717] "></ion-icon></button>
                              </div>
                        </div>
                  </div>
            </>
      )
}
export default InputChat;