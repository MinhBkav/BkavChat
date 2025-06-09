import { useState } from "react"
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
      }
      return (
            <>
                  <div className="fixed w-[calc(100vw-361px)] h-[56px] bottom-0 flex flex-col justify-center items-center bg-white">
                        <div className="relative w-[98.97%] flex justify-between mx-[0.3145rem] my-2">
                              <div className=" flex justify-center items-center">
                                    <ion-icon name="add-circle-outline" className="w-[1.8rem] h-[1.8rem] "></ion-icon>
                              </div>
                              <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn"
                                    className="rounded-full  w-[94.296%] py-[0.37rem] pl-4 text-lg ring-1 ring-slate-300  focus:ring-sky-200  "
                              />
                              <ion-icon
                                    name="happy-outline"
                                    class="w-8 h-8 absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl right-14 " ></ion-icon>
                              <div className="flex justify-center items-center">
                                    <button onClick={() => send()}><ion-icon name="send-sharp" className="w-6 h-6 my-auto ml-[5px] bg-slate-400 p-2 rounded-full text-white"></ion-icon></button>
                              </div>
                        </div>

                  </div>
                  <div className=" h-[56px]"></div>
            </>
      )
}
export default InputChat;