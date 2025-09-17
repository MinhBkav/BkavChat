import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
// import thunk thực tế của bạn
// import { patchMe } from "../../../feature/dataSlice";
import AvatarImage from "../../AvatarImage";
import EditableAvatar from "../../EditableAvatar";
import { updateInfo } from "../../../feature/dataSlice";
export default function OpenMyInfo({ close }) {
  const dispatch = useDispatch();

  // lấy me an toàn
  const me = (() => {
    try { return JSON.parse(localStorage.getItem("me")) || {}; }
    catch { return {}; }
  })();

  const [editingUsername, setEditingUsername] = useState(false);
  const [editingFullname, setEditingFullname] = useState(false);
  const [username, setUsername] = useState(me?.Username || "");
  const [fullname, setFullname] = useState(me?.FullName || "");
  const [avatarUrl, setAvatarUrl] = useState(me?.Avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onAvatarChange =  (file) => {
    // set preview ngay
    setAvatarFile(file);
    console.log("gọi hàm")
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      // Tuỳ API của bạn: nếu có file => FormData, nếu không => JSON
      let isFormData = false;
      const form = new FormData();
       form.append("Username", username);
       form.append("FullName", fullname);
      if (avatarFile) {
        form.append("Avatar", avatarFile);
        isFormData = true;
      }
      console.log(form)
       const url =  await dispatch(updateInfo(form)).unwrap()
       let newMe ;
       if(url.updateObject.Avatar)
       {
       newMe = { ...me, Avatar: url.updateObject.Avatar, Username: username, FullName: fullname };
       }
       else{
        newMe = { ...me, Username: username, FullName: fullname };
       }
      localStorage.setItem("me", JSON.stringify(newMe));

      close();
    } catch (e) {
      setError(e?.message || "Có lỗi khi lưu thông tin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col justify-center items-center px-7 py-4 border-b">
        {/* Dùng EditableAvatar để hover hiện lớp mờ + chữ Sửa */}
        <EditableAvatar
          src={avatarUrl}
          size={80}
          onChange={onAvatarChange}
        />
        <h1 className="font-medium text-xl pt-2">
          {me?.FullName || me?.Username || "My Profile"}
        </h1>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">User Name</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              readOnly={!editingUsername}
              onChange={(e) => setUsername(e.target.value)}
              className={[
                "w-full rounded-xl border px-4 pr-12 py-2 outline-none",
                editingUsername
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 bg-gray-50 text-gray-700"
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setEditingUsername(v => !v)}
              className="absolute inset-y-0 right-2 my-auto h-8 w-8 rounded-lg hover:bg-gray-100 grid place-items-center"
              aria-label={editingUsername ? "Done" : "Edit username"}
              title={editingUsername ? "Done" : "Edit"}
            >
              {editingUsername
                ? <ion-icon name="checkmark-outline"></ion-icon>
                : <ion-icon name="pencil-outline"></ion-icon>}
            </button>
          </div>
        </div>

        {/* Fullname */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={fullname}
              readOnly={!editingFullname}
              onChange={(e) => setFullname(e.target.value)}
              className={[
                "w-full rounded-xl border px-4 pr-12 py-2 outline-none",
                editingFullname
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 bg-gray-50 text-gray-700"
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setEditingFullname(v => !v)}
              className="absolute inset-y-0 right-2 my-auto h-8 w-8 rounded-lg hover:bg-gray-100 grid place-items-center"
              aria-label={editingFullname ? "Done" : "Edit full name"}
              title={editingFullname ? "Done" : "Edit"}
            >
              {editingFullname
                ? <ion-icon name="checkmark-outline"></ion-icon>
                : <ion-icon name="pencil-outline"></ion-icon>}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Nút Lưu (thay cho Đóng) */}
        <div className="pt-[400px] pl-[540px]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl px-4 py-2 bg-gray-900 text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
