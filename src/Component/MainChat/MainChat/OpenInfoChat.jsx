// ChatInfoPanel.jsx
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AvatarImage from "../../AvatarImage";
import { removeMember } from "../../../feature/userSlice";
import { mute } from "../../../feature/dataSlice";
export default function OpenInfoChat({
  close,
  onSearch,
  onOpenProfile,
  onAddMember,
  onToggleMute,
  onRemoveMember,
}) {
  const room = useSelector((state) => state.user.roomChat);
  const data = useSelector((state) => state.user.userChat); 
  const me = JSON.parse(localStorage.getItem("me") || "{}"); 
  const myId = me?.id || me?._id; 
  const dispatch = useDispatch();
  const onMuted =({mode,idChat}) =>{
    dispatch(mute({type: mode,id : idChat}));
 }
  const mode = useMemo(() => room?.type || "solo", [room]);
   let idChat ;
  const { title, avatarUrl, mutedInit } = useMemo(() => {
    if (mode === "group") {
      console.log(idChat)
      const name = data?.name || "Nhóm chưa đặt tên";
      const avatar = data?.avatarUrl;
      return { title: name, avatarUrl: avatar, mutedInit: data?.muted};
    }
    console.log(data.FriendID)
    const name = data?.FullName || data?.name || "Người dùng";
    const avatar = data?.Avatar || data?.avatarUrl;
    return { title: name, avatarUrl: avatar, mutedInit: data?.muted };
  }, [mode, data]);
  if(mode === "group")
    idChat = data._id;
  else
    idChat = data.FriendID;
  const members = useMemo(() => (mode === "group" ? data?.participants || [] : []), [mode, data]);
  const isOwner = useMemo(() => mode === "group" && myId && data?.createdBy && String(myId) === String(data.createdBy), [mode, myId, data]);

  const [muted, setMuted] = useState(!mutedInit);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    onMuted({mode,idChat});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
    onSearch?.(keyword, { mode,data });
  };

  const handleOpenProfile = () => {
    if (mode !== "solo" || !data) return;
    onOpenProfile?.(data);
  };

  const handleAddMember = () => {
    if (mode !== "group" || !data) return;
    onAddMember?.(data);
  };

  //xóa thành viên 
  const confirmAndRemove = async (member) => {
    if (!isOwner) return;
    if (String(member.userId) === String(data?.createdBy)) return; // không xoá creator
    const ok = window.confirm(`Xóa ${member.FullName || "thành viên"} khỏi nhóm?`);
    if (!ok) return;

    dispatch(removeMember({member: member,roomId: data._id}))
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-neutral-900 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AvatarImage
            src={avatarUrl}
            inputcss={"w-12 h-12 object-cover rounded-full overflow-hidden"}
            type={mode}
          />
          <div className="min-w-0 text-center">
            <h2 className="text-base font-semibold truncate">{title}</h2>
            <p className="text-xs text-neutral-500">
              {mode === "group" ? "Nhóm trò chuyện" : "Trò chuyện 1–1"}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-16 px-16">
        {/* Mute */}
        <button
          onClick={handleToggleMute}
          className="flex flex-col items-center gap-1 rounded-xl py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title={muted ? "Bật thông báo" : "Tắt thông báo"}
          aria-label={muted ? "Bật thông báo" : "Tắt thông báo"}
        >
          <ion-icon
            name={muted ? "notifications-off-circle-outline" : "notifications-circle-outline"}
            class="text-2xl"
          />
          <span className="text-xs">{muted ? "Đã tắt" : "Thông báo"}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="flex flex-col items-center gap-1 rounded-xl py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Tìm kiếm trong đoạn chat"
          aria-label="Tìm kiếm trong đoạn chat"
        >
          <ion-icon name="search-circle-outline" class="text-2xl" />
          <span className="text-xs">Tìm kiếm</span>
        </button>

        {/* Solo: Profile */}
        {mode === "solo" && (
          <button
            onClick={handleOpenProfile}
            className="flex flex-col items-center gap-1 rounded-xl py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Trang cá nhân"
            aria-label="Trang cá nhân"
          >
            <ion-icon name="person-circle-outline" class="text-2xl" />
            <span className="text-xs">Trang cá nhân</span>
          </button>
        )}

        {/* Group: Add member */}
        {mode === "group" && (
          <button
            onClick={handleAddMember}
            className="flex flex-col items-center gap-1 rounded-xl py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Thêm thành viên"
            aria-label="Thêm thành viên"
          >
            <ion-icon name="person-add-outline" class="text-2xl" />
            <span className="text-xs">Thêm </span>
          </button>
        )}
      </div>

      {/* Inline search */}
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2">
            <ion-icon name="search-outline" class="text-lg" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Nhập từ khóa cần tìm…"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Xóa từ khóa"
                title="Xóa"
              >
                <ion-icon name="close-circle-outline" class="text-xl" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:opacity-90"
          >
            Tìm
          </button>
        </form>
      )}

      {/* Danh sách thành viên */}
      {mode === "group" && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Thành viên ({members.length})</h3>
            {isOwner ? (
              <span className="text-xs text-neutral-500">Bạn là Quản trị viên</span>
            ) : (
              <span className="text-xs text-neutral-500">Quản trị viên: {members.find(m => String(m.userId) === String(data?.createdBy))?.FullName || "—"}</span>
            )}
          </div>

          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-y-scroll h-[500px]">
            {members.map((m) => {
              const isCreator = String(m.userId) === String(data?.createdBy);
              return (
                <li key={m._id || m.userId} className="flex items-center gap-3 px-3 py-2">
                  <AvatarImage
                    src={m.Avatar}
                    inputcss={"w-8 h-8 object-cover rounded-full overflow-hidden"}
                    type={"solo"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.FullName || "Người dùng"}</div>
                    <div className="text-[11px] text-neutral-500">
                      {isCreator ? "Quản trị viên" : "Thành viên"}
                    </div>
                  </div>

                  {/* Nút XÓA: chỉ hiện với chủ nhóm & không cho xoá chủ */}
                  {isOwner && !isCreator && (
                    <button
                      onClick={() => confirmAndRemove(m)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Xóa khỏi nhóm"
                      aria-label="Xóa khỏi nhóm"
                    >
                      <ion-icon name="trash-outline" class="text-lg" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
