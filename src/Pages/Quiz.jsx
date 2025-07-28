import React, { useState } from 'react';

const questions = [
    {
        question: "Which Docker command is used to create and start containers from a specified image?",
        options: ['docker pull', 'docker run', 'docker rm', 'docker rmi'],
        answer: 'docker run',
    },
    {
        question: "Which command is used to list all running containers in Docker?",
        options: ['docker ps', 'docker images', 'docker ls', 'docker run'],
        answer: 'docker ps',
    },
    {
        question: "Which flag is used with docker run to run a container in detached mode?",
        options: ['-d', '-i', '-t', '--rm'],
        answer: '-d',
    },
];

const Quiz = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showNext, setShowNext] = useState(false);
    const [results, setResults] = useState([]); // lưu kết quả: true/false/null

    const current = questions[currentIndex];

    const handleClick = (option) => {
        if (selected) return;
        setSelected(option);
        const isCorrect = option === current.answer;
        const newResults = [...results];
        newResults[currentIndex] = isCorrect;
        setResults(newResults);
        setShowNext(true);
    };

    const getClass = (opt) => {
        if (!selected) return 'hover:bg-gray-100';

        if (opt === selected && opt === current.answer) {
            return 'bg-green-200 border-green-600 text-black';
        } else if (opt === selected && opt !== current.answer) {
            return 'bg-red-200 border-red-600 text-black';
        } else {
            return 'opacity-50 text-gray-500';
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelected(null);
            setShowNext(false);
        } else {
            alert('🎉 Quiz completed!');
        }
    };

    const getProgressColor = (idx) => {
        if (idx === currentIndex && selected === null) return 'bg-blue-400';
        if (results[idx] === true) return 'bg-green-400';
        if (results[idx] === false) return 'bg-red-400';
        return 'bg-gray-200';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 space-y-4">
                {/* Tiến trình */}
                <div className="w-full">
                    <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Task</span>
                        <span>{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="flex space-x-1">
                        {questions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 rounded-full ${getProgressColor(idx)}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Câu hỏi */}
                <h2 className="text-lg font-medium">{current.question}</h2>

                {/* Lựa chọn */}
                <ul className="space-y-3">
                    {current.options.map((opt) => (
                        <li
                            key={opt}
                            onClick={() => handleClick(opt)}
                            className={`cursor-pointer p-3 rounded-full bg-slate-100 text-center font-[500] transition-all duration-200 ${getClass(opt)}`}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>

                {/* Nút Next */}
                {showNext && (
                    <div className="text-right pt-2">
                        <button
                            onClick={handleNext}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
