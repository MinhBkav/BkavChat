import React from "react";

const AvatarImage = ({ src, inputcss, isOnline }) => {
  const defaultAvatar = "./images/219970.png";

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultAvatar;
  };

  return (
    <div className="relative w-fit">
      <img
        src={src || defaultAvatar}
        alt="Avatar"
        onError={handleError}
        className={`${inputcss}`}
      />
      {/* Icon trạng thái online/offline */}
      <span
        className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? "bg-green-500" : "hidden"
        }`}
      />
    </div>
  );
};

export default AvatarImage;
