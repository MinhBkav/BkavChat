import { useEffect } from "react";

export const useClickOutside = (ref, handler, enabled) => {
  useEffect(() => {
    if (!enabled) return;
    const listener = (e) => {
        console.log(ref.current)
        console.log(ref.current.contains(e.target))
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, enabled]);
};
