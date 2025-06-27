import React from "react";

const AvatarImage = ({ src, inputcss}) => {
  const defaultAvatar = "./images/219970.png";

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultAvatar;
  };

  return (
    <img
      src={src || defaultAvatar}
      alt="Avatar"
      onError={handleError}
      className={`${inputcss}`}
    />
  );
};

export default AvatarImage;
