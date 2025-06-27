import { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addMessage, sendMessage } from "../../../feature/userSlice"
import { addMessageData, setInputMessage } from "../../../feature/dataSlice"

export const InputChat = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const inputMessage = useSelector((state) => state.data.inputMessage)
  const userid = useSelector(state => state.data.currentuserid)
  const FriendID = useSelector(state => state.user.userChat.FriendID)
  const [attachedFiles, setAttachedFiles] = useState([])

  const onChange = (e) => {
    dispatch(setInputMessage(e.target.value))
  }

  const clearInput = () => {
    dispatch(setInputMessage(''))
    setAttachedFiles([]) // Clear files
  }

  const send = () => {
    dispatch(addMessage({
      Content: inputMessage,
      Files: [],
      Images: [], // Xử lý hình riêng nếu cần
      isSend: 1,
      CreatedAt: new Date().toISOString(),
      MessageType: 1
    }))
    dispatch(sendMessage({ FriendID, Content: inputMessage, file: attachedFiles }))
    clearInput()
  }

  const handleFileClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      {/* File hiển thị trước khi gửi */}
      {attachedFiles.length > 0 && (
        <div className="w-full px-4 pb-1 flex gap-2 overflow-x-auto">
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

      <div className="h-[56px] w-full flex flex-col justify-center items-center bg-white dark:bg-[#171717]">
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
            className="w-8 h-8 absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-blue-500 text-xl right-14"
          />
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
