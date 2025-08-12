import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AvatarImage from "../../AvatarImage";
import { createRoom } from "../../../feature/dataSlice";
export default function CreateGroupModal() {
  const listUser = useSelector((state) => state.data.chatData);
  const [groupName, setGroupName] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(new Set());
  const me = useSelector(state=>state.login.me)
  console.log(me.id)
  const dispatch = useDispatch()

  const users = Array.isArray(listUser) ? listUser : [];
    const onCreate =(infoRoom)=>{
        console.log(infoRoom.userIds)
        dispatch(createRoom({createdBy: infoRoom.createdBy,name: infoRoom.name,userIds:infoRoom.userIds}))
    }
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const arr = users
      .filter(Boolean)
      .map((u) => ({
        id: u.FriendID,
        name: u.FullName || u.Username || "No name",
        username: u.Username || "",
        avatar: u.Avatar || null,
        updatedAt: u.UpdateAtUser ? new Date(u.UpdateAtUser).getTime() : 0,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
    if (!keyword) return arr;
    return arr.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.username.toLowerCase().includes(keyword)
    );
  }, [users, q]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleCreate = () => {
    if (groupName.trim() && selected.size > 0) {
      onCreate?.({
        createdBy : me.id,
        name: groupName.trim(),
        userIds: Array.from(selected),
      });
    }
  };

  const canCreate = groupName.trim() && selected.size >= 3;

  return (
    <div className="flex h-full flex-col ">
      {/* Header */}
      <div className="px-7 py-4 border-b">
        <h2 className="text-xl font-semibold">Tạo nhóm</h2>
      </div>

      {/* Group name */}
      <div className="px-7 pt-4">
        <label className="block text-sm font-medium mb-1">Tên nhóm</label>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Nhập tên nhóm..."
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
          maxLength={100}
        />
      </div>

      {/* Search */}
      <div className="px-7 pt-4">
        <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nhập tên hoặc username..."
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* List */}
      <div className="px-2 sm:px-7 pt-4 pb-5 mt-5 overflow-auto flex-1 custom-scrollbar">
        <div className="text-sm text-gray-500 mb-2">
          {filtered.length} kết quả
        </div>

        <ul className="divide-y rounded-xl border">
          {filtered.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleSelect(u.id)}
            >
              {/* Avatar */}
              {u.avatar ? (
                <AvatarImage
                  src={u.avatar}
                  inputcss="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              )}

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{u.name}</p>
                {u.username && (
                  <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                )}
              </div>

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.has(u.id)}
                readOnly
                className="w-4 h-4 accent-blue-500"
              />
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500 text-sm">
              Không tìm thấy người dùng phù hợp
            </li>
          )}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className={`w-full py-2 rounded-xl text-white font-semibold ${
            canCreate
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Tạo nhóm
        </button>
      </div>
    </div>
  );
}
