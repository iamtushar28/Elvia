'use client';

import React, { useState } from 'react'; // Import useState
import { FaArrowRight } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri"; // For loading spinner

// FillBlankQuestionCard now accepts questionData and onAnswerSubmit
const FillBlankQuestionCard = ({ questionData, onAnswerSubmit }) => {
    const [typedAnswer, setTypedAnswer] = useState(''); // State for user's typed answer
    const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading

    const handleNextQuestion = async () => {
        if (typedAnswer.trim() === '') {
            alert("Please type your answer before proceeding.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Call the onAnswerSubmit function passed from GameRoomManager
            // Pass the question's unique ID and the user's typed answer
            await onAnswerSubmit(questionData.id || questionData.questionText, typedAnswer.trim());
            setTypedAnswer(''); // Reset input for next question
        } catch (error) {
            console.error("Error handling next question:", error);
            // Error is already handled by GameRoomManager's onAnswerSubmit
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='w-full h-fit p-4 md:p-10 bg-white border border-zinc-200 rounded-lg flex flex-col gap-6 md:gap-10'>

            {/* question */}
            <h4 className='md:text-lg font-semibold'>
                {questionData.questionText}
            </h4>

            {/* answers */}
            <div className='flex flex-col gap-6'>

                <input
                    type="text"
                    placeholder='Type your answer here...'
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    className='w-full h-14 md:h-16 px-4 border-2 border-zinc-200 hover:border-violet-400 rounded-lg flex justify-start items-center gap-4 outline-none cursor-pointer transition-all duration-300'
                    disabled={isSubmitting} // Disable input while submitting
                />

            </div>

            {/* next question */}
            <div className='flex justify-end'>
                <button
                    onClick={handleNextQuestion}
                    disabled={isSubmitting || typedAnswer.trim() === ''} // Disable if submitting or answer is empty
                    className={`
                        w-fit px-6 py-2 text-white bg-violet-500 rounded-lg
                        cursor-pointer transition-all duration-300 flex gap-3 items-center
                        ${isSubmitting || typedAnswer.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-600'}
                    `}
                >
                    {isSubmitting ? (
                        <RiLoader2Fill className="animate-spin text-xl" />
                    ) : (
                        <>
                            Next
                            <FaArrowRight />
                        </>
                    )}
                </button>
            </div>

        </div>
    );
};

export default FillBlankQuestionCard;
