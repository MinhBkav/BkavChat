import { useRef, useState } from "react";
const defaultAvatar = "./images/219970.png"

export default function EditableAvatar({
  src,
  size = 96,                // px
  rounded = "rounded-full", // hoặc 'rounded-2xl'
  className = "",
  onChange,                 // async (file, previewUrl) => { ...upload... }
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    console.log(url)
    try {
      setUploading(true);
      // Cho phép phía ngoài upload thật (dispatch/API)
       onChange(file);
      console.log(file)
    } finally {
      setUploading(false);
    }
  };
  const avatar = src ? `http://30.30.30.12:8080/api/images${src}` : defaultAvatar
  const displaySrc = preview ||avatar;
    console.log(displaySrc)
  return (
    <div
      className={`group relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ảnh */}
      <img
        src={displaySrc}
        alt="Avatar"
        className={`h-full w-full object-cover ${rounded} border`}
        draggable={false}
      />

      {/* Overlay mờ + chữ "Sửa" (ẩn, chỉ hiện khi hover) */}
      <button
        type="button"
        onClick={openPicker}
        className={`absolute inset-0 ${rounded} 
                    grid place-items-center 
                    bg-black/50 opacity-0 
                    group-hover:opacity-100 
                    transition-opacity duration-200
                    focus:opacity-100 outline-none`}
        aria-label="Sửa ảnh đại diện"
      >
        <span className="text-white text-sm font-medium">
          {uploading ? "Đang tải..." : "Sửa"}
        </span>
      </button>

      {/* Input file ẩn */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}
