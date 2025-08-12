import { EmotionMessage } from "../../../feature/userSlice.jsx";
import { useDispatch } from "react-redux";

const emotion = ["❤️", "👍", "👎", "😂", "😮", "😞"];

const Emotion = ({ showEmotion, positionE, hanlderEnter, hanlderLeave, mes }) => {
    const dispatch = useDispatch();
    if (!showEmotion) return null;
    console.log(mes)
    const saveEmotion = (index) => {
        console.log(mes.Emotion)
        if(!mes.Emotion)
        dispatch(EmotionMessage(mes.id,index));
        else dispatch(EmotionMessage(mes.id,null));
    };

    return (
        <div
            className="absolute z-30"
            style={{
                bottom: "calc(80% + 9px)",
                ...(positionE === "right" ? { left: "0%" } : { right: "0%" }),
            }}
            onMouseEnter={hanlderEnter}
            onMouseLeave={hanlderLeave}
        >
            <div className="w-[342px] h-[62px] flex p-2 gap-[10px] rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.25)] bg-white dark:bg-slate-600 ">
                {emotion.map((item, index) => (
                    <button
                        key={index}
                        className={`${mes.Emotion === index ? 'bg-sky-700' : ''} flex-1 hover:bg-[#669FFF] rounded-2xl`}
                        onClick={() => saveEmotion(index)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Emotion;
