import { useEffect, useState, useRef } from 'react';
export const Timehover =(setShowEmotion,close,time) => {
    const timeoutRef = useRef(null)
       const hanlderEnter = () => {
          clearTimeout(timeoutRef.current);
          setShowEmotion(true)
       }
       const hanlderLeave = () => {
          timeoutRef.current = setTimeout(() => {
             setShowEmotion(false)
            close()
          }, time)
       }
       return {hanlderEnter,hanlderLeave}
}
