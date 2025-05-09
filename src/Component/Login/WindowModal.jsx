
import { AnimatePresence,motion } from "framer-motion";
import React from "react";

export const WindowModal=({ isOpen,message,onClose,title,firstRegsiter}) => {
  if (!isOpen) return null; 

  return (
    <AnimatePresence>
      {isOpen && (
      <div
      className="absolute z-4 top-0 left-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose} 
    >
    <motion.div
    initial = {{scale:0,opacity:0}}
    animate = {{scale:1,opacity:1}}
    exit = {{scale:0,opacity:0}}
    transition = {{duration:0.3,ease:"easeOut"}}
    >
    <div
        className="bg-white text-center p-6 rounded-md shadow-lg h-1/12 w-2/3"
        onClick={(e) => e.stopPropagation()} 
      >
        <h3 className="text-sm text-start font-semibold mb-2">Xác thực email</h3>
        <p className = "text-sm text-start">{title}</p>
      </div>
    </motion.div>
    </div>
    )}
    </AnimatePresence>
  );
}
export default WindowModal;
