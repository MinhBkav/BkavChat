
export const Emotion = ({ showEmotion, positionE , hanlderEnter,hanlderLeave}) => {
  if (!showEmotion) {
    return null;
  }
  const saveEmotion = () => {

  }
  return (
    <>
      <div className="absolute z-20 " style={{
        bottom: "calc(80% + 9px)",
        ...(positionE === "right" ?{left :"0%"}: {right : "0%"})
      }}
      onMouseEnter={hanlderEnter} onMouseLeave={hanlderLeave} 
      >
        <div className="w-[342px] h-[62px] flex p-2 gap-[10px] rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.25)] bg-white dark:bg-slate-600  ">
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl"   >❤️</button>
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl ">👍</button>
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl">👎</button>
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl">😂</button>
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl">😮</button>
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl">😞</button>
        </div>
      </div>
    </>
  )
}