'use client';

import React, { useState } from 'react'; // Import useState for isEditing
import { LuListChecks } from "react-icons/lu";
import { LuTimer } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri"; // Import a pencil icon

const QuizInfo = ({ totalQuestions, completeQuestions, incompleteQuestions, totalEstimateTime, quizName, setQuizName }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempQuizName, setTempQuizName] = useState(quizName); // Local state for input value

    // Update tempQuizName if quizName prop changes (e.g., from default value)
    React.useEffect(() => {
        setTempQuizName(quizName);
    }, [quizName]);

    const handleNameChange = (e) => {
        setTempQuizName(e.target.value); //changing quiz name
    };

    const handleSaveName = () => {
        setQuizName(tempQuizName); // Update the parent's state
        setIsEditingName(false);
    };

    const handleCancelEdit = () => {
        setTempQuizName(quizName); // Revert to original name
        setIsEditingName(false);
    };

    // format time (e.g. 1 min, 20 sec)
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes === 0) return `${seconds} sec`;
        if (seconds === 0) return `${minutes} min`;
        return `${minutes} min ${seconds} sec`;
    };

    return (
        <section className='w-full pt-[66px] px-3 md:px-10 lg:px-36 mt-8'>
            <div className='w-full h-auto px-3 md:px-6 py-5 md:py-8 bg-white rounded-lg shadow flex flex-col gap-4 md:gap-6'>

                {/* quiz name - now editable */}
                <div className="text-[#8570C0] flex items-center gap-2">
                    {isEditingName ? (
                        <>
                            <input
                                type="text"
                                value={tempQuizName}
                                onChange={handleNameChange}
                                onBlur={handleSaveName} // Save on blur
                                onKeyDown={(e) => { // Save on Enter key
                                    if (e.key === 'Enter') {
                                        handleSaveName();
                                        e.target.blur(); // Remove focus
                                    } else if (e.key === 'Escape') { // Cancel on Escape key
                                        handleCancelEdit();
                                        e.target.blur();
                                    }
                                }}
                                className='w-fit text-lg font-semibold border-b border-violet-300 outline-none p-1'
                                autoFocus // Focus on input when it appears
                            />
                        </>
                    ) : (
                        <h2
                            className='text-lg font-semibold flex items-center gap-2 cursor-pointer hover:underline'
                            onClick={() => setIsEditingName(true)} // Click to edit
                        >
                            {quizName} <RiPencilLine className="text-zinc-500" />
                        </h2>
                    )}
                </div>

                {/* quiz information */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col md:flex-row gap-1 md:gap-4 items-center'>

                        {/* total Questions */}
                        <h4 className='text-zinc-800 font-[500] text-lg flex items-center gap-2'>
                            <LuListChecks className='text-xl text-[#8570C0]' />
                            Questions: {totalQuestions}
                        </h4>

                        {/* total incomplete Questions */}
                        {totalQuestions > 0 && incompleteQuestions > 0 && (
                            <button className='px-2 md:px-3 py-1 text-xs md:text-sm text-red-500 bg-red-50 rounded-2xl'>
                                {incompleteQuestions} incomplete
                            </button>
                        )}

                        {/* total complete Questions */}
                        {totalQuestions > 0 && incompleteQuestions === 0 && (
                            <button className='px-2 md:px-3 py-1 text-xs md:text-sm text-green-600 bg-green-50 rounded-2xl'>
                                Completed
                            </button>
                        )}
                    </div>

                    {/* total est. time to complete quiz */}
                    <h4 className='text-zinc-800 text-xs md:text-base flex gap-1 md:gap-2 items-center'>
                        <LuTimer className='text-xl text-[#8570C0]' />
                        Est. time: {formatTime(totalEstimateTime)}
                    </h4>

                </div>

                {/* total user join limit indicator */}
                <div className='w-full h-8 md:h-12 px-4 text-xs md:text-sm text-blue-600 bg-blue-50 flex gap-2 justify-start items-center rounded-lg border border-blue-400'>
                    <FiUsers />
                    Up to 10 players can join your quiz
                </div>
                
            </div>
        </section>
    );
};

export default QuizInfo;
