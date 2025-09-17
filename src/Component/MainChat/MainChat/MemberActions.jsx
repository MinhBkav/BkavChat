import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeMember } from "../../../feature/userSlice";

export default function MemberActions({ member, data, isOwner }) {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemoveClick = () => {
    if (!isOwner) return;
    if (String(member.userId) === String(data?.createdBy)) return; // không xoá creator
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    dispatch(removeMember({ member, roomId: data._id }));
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleRemoveClick}
        className="text-red-500 hover:underline"
      >
        Xóa
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">
              Xóa {member.FullName || "thành viên"} khỏi nhóm?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
