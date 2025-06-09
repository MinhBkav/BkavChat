
export const Emotion = ({ showEmotion, positionE }) => {
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
      >
        <div className="w-[342px] h-[62px] flex p-2 gap-[10px] rounded-3xl ring-1 ring-slate-200 shadow-xl bg-white ">
          <button className="flex-1 hover:bg-[#669FFF] rounded-2xl" Onclick = {saveEmotion} >❤️</button>
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