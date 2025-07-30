import { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addMessage, sendMessage } from "../../../feature/userSlice"
import { setCheckRepair, setCheckScroll, setInputMessage } from "../../../feature/dataSlice"
import { useClickOutside } from "../../../Hooks/useClickOutside"
import { repairMessage,setMessageReply } from "../../../feature/userSlice"
export const InputChat = () => {
  const emojiList = ["😀", "😂", "😍", "😢", "👍", "🙏", "🎉", "💯", "🔥", "🥺", "🤔"]
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const inputMessage = useSelector((state) => state.data.inputMessage)
  const checkrepair = useSelector(state => state.data.checkrepair)
  const FriendID = useSelector(state => state.user.userChat.FriendID)
  const messagereplyId = useSelector(state => state.user.messagereplyId)
    const whmessMain = useSelector(state => state.user.whmessMain )
    const messageId = useSelector(state =>state.user.messageId)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showEmoji, setShowEmoji] = useState(false)
  const emojiRef = useRef(null)
  const onChange = (e) => {
    dispatch(setInputMessage(e.target.value))
  }

  const clearInput = () => {
    dispatch(setInputMessage(''))
    setAttachedFiles([]) // Clear files
  }


 const handlecloseRepair =() =>{
      dispatch(setCheckRepair(false));
   }
   const handlecloseReply =() =>{
      dispatch(setMessageReply({}));
   }
  const handleFileClick = () => {
    fileInputRef.current.click()
  }
  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachedFiles(prev => [...prev, ...files])
  }
    console.log(attachedFiles)

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }
    const send = () => {
        console.log(checkrepair)
        if(checkrepair){
            console.log(inputMessage)
            dispatch(repairMessage(messageId,inputMessage))
            dispatch(setCheckRepair(false))
            clearInput()
            return
        }
        dispatch(setCheckScroll(false))
        dispatch(sendMessage({ FriendID, Content: inputMessage, file: attachedFiles ,messagereplyId: messagereplyId ,whmessMain :whmessMain}))
        console.log(messagereplyId)
        console.log(whmessMain)
        dispatch(setMessageReply({}))
        clearInput()
    }
  const close =()=>{
    setShowEmoji(false)
  }
 useClickOutside(emojiRef,close,showEmoji)
  return (
    <>
      {/* File hiển thị trước khi gửi */}
      {attachedFiles.length > 0 && (
        <div className="  max-w-3xl px-4 pb-1 flex gap-2 overflow-x-auto custom-scrollbar">
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center bg-slate-100 dark:bg-slate-700 text-sm px-2 py-1 rounded-md relative">
              <ion-icon name="document-outline" className="text-blue-500 mr-1" />
              <span className="truncate max-w-[100px]">{file.name}</span>
              <button onClick={() => removeFile(index)} className="ml-2 text-red-500 hover:text-red-700">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    {checkrepair&&(<div className = "  z-30  h-8 bg-slate-300  flex justify-between items-center px-2  ">
                <p1 className = "text-center">Sửa tin nhắn </p1>
                <button onClick={handlecloseRepair}><ion-icon name="close-outline" className = "hover:bg-slate-500 hover:rounded"></ion-icon></button>
              </div>)} 
    {messagereplyId&&(<div className = "  z-30  h-8 bg-slate-300  flex justify-between items-center px-2  ">
      <p1 className = "text-center">Trả lời tin nhắn</p1>
      <button onClick={handlecloseReply}><ion-icon name="close-outline" className = "hover:bg-slate-500 hover:rounded"></ion-icon></button>
    </div>)} 
      <div className="h-[56px] w-full flex flex-col justify-center items-center bg-white dark:bg-[#171717] z-20">
        <div className="relative w-full flex justify-between px-[0.3145rem] my-2">
          <div className="flex justify-center items-center pr-1">
            <button onClick={handleFileClick}>
              <ion-icon name="add-circle-outline" className="w-[1.8rem] h-[1.8rem] dark:text-blue-600" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              multiple
            />
          </div>
          <input
            type="text"
            value={inputMessage}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                send()
              }
            }}
            placeholder="Nhập tin nhắn"
            className="rounded-full w-full m-auto h-[40px] pl-4 text-lg ring-1 dark:text-white ring-slate-300 dark:ring-slate-600 outline-none dark:bg-slate-600"
          />
          <ion-icon
            name="happy-outline"
            onClick={() => setShowEmoji(prev => !prev)}
            className="w-8 h-8 absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-blue-500 text-xl right-14"
          />
          {showEmoji && (
            <div className="absolute bottom-14 right-14 z-50 bg-white dark:bg-slate-800 p-2 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.25)] max-w-[200px] flex flex-wrap gap-1 " ref ={emojiRef}>
              {emojiList.map((emoji, index) => (
                <button
                  key={index}
                  className="text-xl hover:scale-125 transition-transform"
                  onClick={() => dispatch(setInputMessage(inputMessage + emoji))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center pl-2">
            <button onClick={send}>
              <ion-icon name="send-sharp" className="w-[1.5em] h-[1.5em] bg-slate-400 dark:bg-blue-600 py-[0.65rem] pl-[0.7rem] pr-[0.5rem] rounded-full text-white dark:text-[#171717]" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InputChat 
