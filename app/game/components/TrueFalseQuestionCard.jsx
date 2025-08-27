'use client';

import React, { useState } from 'react'; // Import useState
import { RiLoader2Fill } from "react-icons/ri"; // For loading spinner

// TrueFalseQuestionCard now accepts questionData and onAnswerSubmit
const TrueFalseQuestionCard = ({ questionData, onAnswerSubmit }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null); // State for user's selected answer (true or false)
    const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = async () => {

        setIsSubmitting(true);
        try {
            // Convert the boolean selectedAnswer to a string ('True' or 'False')
            const answerAsString = selectedAnswer ? 'True' : 'False';

            // Call the onAnswerSubmit function passed from GameRoomManager
            // Pass the question's unique ID and the user's selected answer (true/false)
            await onAnswerSubmit(questionData.id || questionData.questionText, answerAsString);
            setSelectedAnswer(null); // Reset selection for next question

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
            <div className='flex flex-col gap-4 md:gap-6'>

                {/* True option */}
                <button
                    onClick={() => handleAnswerSelect(true)}
                    className={`
                        w-full h-14 md:h-16 px-4 border-2 rounded-lg flex justify-start items-center gap-4 cursor-pointer transition-all duration-300
                        ${selectedAnswer === true ? 'bg-violet-100 border-violet-500' : 'border-zinc-200 hover:bg-violet-50 hover:border-violet-400'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                    disabled={isSubmitting}
                >
                    <div className={`
                        h-8 w-8 rounded-full flex justify-center items-center
                        ${selectedAnswer === true ? 'bg-violet-500 text-white' : 'text-violet-400 bg-violet-100'}
                    `}>
                        T
                    </div>
                    True
                </button>

                {/* False option */}
                <button
                    onClick={() => handleAnswerSelect(false)}
                    className={`
                        w-full h-14 md:h-16 px-4 border-2 rounded-lg flex justify-start items-center gap-4 cursor-pointer transition-all duration-300
                        ${selectedAnswer === false ? 'bg-violet-100 border-violet-500' : 'border-zinc-200 hover:bg-violet-50 hover:border-violet-400'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                    disabled={isSubmitting}
                >
                    <div className={`
                        h-8 w-8 rounded-full flex justify-center items-center
                        ${selectedAnswer === false ? 'bg-violet-500 text-white' : 'text-violet-400 bg-violet-100'}
                    `}>
                        F
                    </div>
                    False
                </button>

                {/* next question button */}
                <div className='flex justify-end'>
                    <button
                        onClick={handleNextQuestion}
                        disabled={isSubmitting || selectedAnswer === null} // Disable if submitting or no answer selected
                        className={`
                            w-fit px-6 py-2 text-white bg-violet-500 rounded-lg
                            cursor-pointer transition-all duration-300 flex gap-3 items-center
                            ${isSubmitting || selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-600'}
                        `}
                    >
                        {isSubmitting ? (
                            <RiLoader2Fill className="animate-spin text-xl" />
                        ) : (
                            <>
                                Submit
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrueFalseQuestionCard;
