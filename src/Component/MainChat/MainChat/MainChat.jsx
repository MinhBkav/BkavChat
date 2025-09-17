import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputChat } from "./InputChat";
import { HeaderUser } from "./HeaderUser";
import { Chat } from "./Chat";
import { mute } from "../../../feature/dataSlice";
import { setOpenCreateRoom ,setOpenMyInfo,setOpenInfoChat} from "../../../feature/dataSlice";
import CreateGroupModal from "./CreateGroupModal";
import OpenMyInfo from "./OpenMyInfo";
import  OpenInfoChat  from "./OpenInfoChat";
export const MainChat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userChat);
  const room = useSelector((state) => state.user.roomChat);
  let name;
  if(user)
    name = user.FullName
  if(room) 
    name = room.name
  const openCreateRoom = useSelector((state) => state.data.openCreatRoom);
  const openInfoChat = useSelector (state=> state.data.openInfoChat)
  const openMyInfo = useSelector (state=> state.data.openMyInfo)
  const listUser = useSelector(state => state.data.chatData)
  const isEmptyUser = (!user || Object.keys(user).length === 0) && (!room || Object.keys(room).length === 0);
  const closeCreateRoom = useCallback(() => {
    dispatch(setOpenCreateRoom(false));
  }, [dispatch]);
    const closeInfoChat = useCallback(() => {
    dispatch(setOpenInfoChat(false));
  }, [dispatch]);
 const closeMyInfo = useCallback(() => {
    dispatch(setOpenMyInfo(false));
  }, [dispatch]);
  // Đóng bằng phím Esc
  useEffect(() => {
    if (!openCreateRoom) return;
    const onKey = (e) => e.key === "Escape" && closeCreateRoom();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCreateRoom, closeCreateRoom]);
 
  return (
    <main className="flex flex-col h-screen justify-between bg-white dark:bg-[#171717] flex-1">
      {isEmptyUser ? (
        <img src="./images/IconChat.png" alt="No conversation" className="h-36 m-auto" />
      ) : (
        <>
          <HeaderUser />
          <Chat />
          <InputChat />
        </>
      )}

      {/* Modal Create Room */}
      {openCreateRoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
          onClick={closeCreateRoom} // click nền đóng
          role="dialog"
          aria-modal="true"
          aria-label="Tạo nhóm"
        >
          <div
            className="2xl:w-1/3 sm:w-1/2 w-2/3 sm:h-5/6 h-4/6 bg-white rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateGroupModal close ={closeCreateRoom} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeCreateRoom();
            }}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            type="button"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>
      )}
        {openInfoChat && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
          onClick={closeInfoChat} // click nền đóng
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <div
            className="2xl:w-1/3 sm:w-1/2 w-2/3 sm:h-5/6 h-4/6 bg-white rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <OpenInfoChat 
              close ={closeInfoChat} 
              onSearch={(keyword) => console.log("Search:", keyword)}
              onOpenProfile={(user) => console.log("Open profile:", user)}
              onAddMember={(room) => console.log("Add member for room:", room)}
              onToggleMute={(mode,idChat)=>onMuted(mode,idChat)}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeInfoChat();
            }}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            type="button"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>
      )}
      {openMyInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
          onClick={closeMyInfo} // click nền đóng
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <div
            className="2xl:w-1/3 sm:w-1/2 w-2/3 sm:h-5/6 h-4/6 bg-white rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <OpenMyInfo close ={closeMyInfo} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeMyInfo();
            }}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            type="button"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>
      )}
    </main>
  );
};

export default MainChat;
