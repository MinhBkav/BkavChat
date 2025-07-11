import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
const AutoScrollToBottom = () => {
  const bottomRef = useRef(null);
  const checkScroll = useSelector(state=> state.data.checkScroll)
  useEffect(() => {
    if(checkScroll)
      return 
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return <div ref={bottomRef} />;
};

export default AutoScrollToBottom;
