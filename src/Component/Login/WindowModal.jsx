
import React from "react";

export const WindowModal=({ isOpen,message,onClose,title}) => {
  if (!isOpen) return null; 

  return (
    <div
      className="absolute z-4 top-0 left-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose} 
    >
      <div
        className="bg-white text-center p-6 rounded-md shadow-lg h-1/12 w-1/3"
        onClick={(e) => e.stopPropagation()} 
      >
        <h3 className="text-sm text-start font-semibold mb-2">Xác thực email</h3>
        <p className = "text-sm text-start">{title}</p>
      </div>
    </div>
  );
}
export default WindowModal;
