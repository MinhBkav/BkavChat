import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputChat } from "./InputChat";
import { HeaderUser } from "./HeaderUser";
import { Chat } from "./Chat";
import { setOpenCreateRoom } from "../../../feature/dataSlice";
import CreateGroupModal from "./CreateGroupModal";
export const MainChat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userChat);
  const openCreateRoom = useSelector((state) => state.data.openCreatRoom);
  const listUser = useSelector(state => state.data.chatData)
  const isEmptyUser = !user || Object.keys(user).length === 0;

  const closeCreateRoom = useCallback(() => {
    dispatch(setOpenCreateRoom(false));
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
  <CreateGroupModal />
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
    </main>
  );
};

export default MainChat;
