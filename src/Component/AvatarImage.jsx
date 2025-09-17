import React from "react";

const checkAvatarSocial = (url) => {
  if (!url) return false;        // nếu null/undefined thì false
  return url.includes("http");   // dùng includes đúng chính tả
};

const AvatarImage = ({ src, inputcss, isOnline, type = "solo" }) => {
  const defaultAvatar =
    type === "solo" ? "./images/219970.png" : "./images/3950923.png";

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultAvatar;
  };

  const finalSrc = src
    ? checkAvatarSocial(src)
      ? src
      : `http://30.30.30.12:8080/api/images${src}`
    : defaultAvatar;

  return (
    <div className="relative w-fit">
      <img
        src={finalSrc}
        alt="Avatar"
        onError={handleError}
        className={inputcss}
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
