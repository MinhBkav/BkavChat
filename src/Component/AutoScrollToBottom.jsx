import { useEffect, useRef } from "react";

const AutoScrollToBottom = () => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return <div ref={bottomRef} />;
};

export default AutoScrollToBottom;
