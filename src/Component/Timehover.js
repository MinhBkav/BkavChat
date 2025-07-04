import { useEffect, useState, useRef } from 'react';
export const Timehover =(setShowEmotion,close) => {
    const timeoutRef = useRef(null)
       const hanlderEnter = () => {
          clearTimeout(timeoutRef.current);
          setShowEmotion(true)
       }
       const hanlderLeave = () => {
          timeoutRef.current = setTimeout(() => {
             setShowEmotion(false)
          }, 100)
          close()
       }
       return {hanlderEnter,hanlderLeave}
}
