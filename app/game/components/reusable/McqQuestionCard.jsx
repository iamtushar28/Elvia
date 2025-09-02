'use client';

import React, { useState } from 'react'; // Import useState
import { RiLoader2Fill } from "react-icons/ri"; // For loading spinner
import { GrNext } from "react-icons/gr";

// McqQuestionCard now accepts questionData and onAnswerSubmit
const McqQuestionCard = ({ questionData, onAnswerSubmit }) => {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // State for user's selected option
    const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading

    // Map option indexes to letters for display
    const optionLetters = ['A', 'B', 'C', 'D'];

    const handleOptionSelect = (index) => {
        setSelectedOptionIndex(index);
    };

    const handleNextQuestion = async () => {
        if (selectedOptionIndex === null) {
            alert("Please select an answer before proceeding.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onAnswerSubmit(questionData.id || questionData.questionText, selectedOptionIndex); // Pass selected index
            setSelectedOptionIndex(null); // Reset selection for next question
        } catch (error) {
            console.error("Error handling next question:", error);
            // Error is already handled by GameRoomManager's onAnswerSubmit
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='w-full h-fit p-4 md:p-8 bg-white border border-zinc-200 rounded-2xl flex flex-col gap-6 md:gap-10'>

            {/* question */}
            <h4 className='md:text-lg font-semibold'>
                {questionData.questionText}
            </h4>

            {/* answers */}
            <div className='flex flex-col gap-4'>
                {questionData.options.map((option, index) => (
                    <button
                        key={index} // Use index as key for options within a question
                        onClick={() => handleOptionSelect(index)}
                        className={`
                            w-full h-fit py-3 px-2 md:px-4 md:py-4 border-1 rounded-xl flex justify-start items-start gap-2 md:gap-4 cursor-pointer transition-all duration-300
                            ${selectedOptionIndex === index ? 'bg-violet-100 border-violet-500' : 'border-zinc-200 hover:bg-violet-50 hover:border-violet-400'}
                            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                        disabled={isSubmitting}
                    >
                        {/* options index A/B/C/D */}
                        <div className={`
                            min-h-8 min-w-8 rounded-full flex justify-center items-center
                            ${selectedOptionIndex === index ? 'bg-violet-500 text-white' : 'text-violet-400 bg-violet-100'}
                        `}>
                            {optionLetters[index]}
                        </div>

                        {/* options */}
                        <p className='text-start'>{option.optionText}</p>

                    </button>
                ))}

                {/* next question button */}
                <div className='flex justify-end'>
                    <button
                        onClick={handleNextQuestion}
                        disabled={isSubmitting || selectedOptionIndex === null} // Disable if submitting or no option selected
                        className={`
                            w-fit px-5 py-2 text-white bg-violet-500 rounded-3xl
                            cursor-pointer transition-all duration-300 flex gap-2 items-center
                            ${isSubmitting || selectedOptionIndex === null ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-600'}
                        `}
                    >
                        {isSubmitting ? (
                            <RiLoader2Fill className="animate-spin text-xl" />
                        ) : (
                            <>
                                Next
                                <GrNext />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default McqQuestionCard;
