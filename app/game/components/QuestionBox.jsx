'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { LuTimer } from "react-icons/lu";

// Import your specific question card components
import McqQuestionCard from './reusable/McqQuestionCard';
import TrueFalseQuestionCard from './reusable/TrueFalseQuestionCard';
import FillBlankQuestionCard from './reusable/FillBlankQuestionCard';

const QuestionBox = ({ question, questionNumber, totalQuestions, onAnswerSubmit, currentPlayerProfile }) => {
    // State for the countdown timer
    const [timerCount, setTimerCount] = useState(question.timeLimit || 20);

    // Effect to manage the countdown timer
    useEffect(() => {
        // Reset timer when question changes
        setTimerCount(question.timeLimit || 20);

        // Set up the interval for the countdown
        const timerInterval = setInterval(() => {
            setTimerCount(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timerInterval); // Stop the timer when it reaches 0
                    // Automatically submit a null/skipped answer if time runs out
                    // Pass a unique identifier for the question and null as the answer
                    onAnswerSubmit(question.id || question.questionText, null);
                    return 0; // Ensure count is 0
                }
                return prevCount - 1;
            });
        }, 1000); // Decrement every 1 second

        // Cleanup function to clear the interval when the component unmounts
        // or when the question changes (effect re-runs)
        return () => clearInterval(timerInterval);
    }, [question, onAnswerSubmit]); // Re-run effect when question or onAnswerSubmit changes

    if (!question) {
        return (
            <section className='min-h-screen h-auto pt-20 pb-8 px-4 w-full flex justify-center relative'>
                <div className='w-full md:w-[70%] h-fit flex flex-col gap-6 md:gap-10 text-center text-zinc-500'>
                    No question available.
                </div>
            </section>
        );
    }

    return (
        <section className='min-h-screen h-auto pt-20 pb-8 px-4 w-full flex justify-center relative'>
            <div className='w-full md:w-[70%] h-fit flex flex-col gap-6 md:gap-10'>

                <div className='w-full flex justify-between items-center'>
                    {/* title */}
                    <h2 className='text-lg md:text-2xl font-semibold'>
                        Question {questionNumber} of {totalQuestions}
                    </h2>

                    {/* quiz timer */}
                    <h2 className='text-lg md:text-2xl font-semibold flex gap-2 items-center'>
                        <LuTimer className={`${(timerCount < 10) ? 'text-red-500 animate-pulse' : 'text-[#8570C0E6]'}`} />
                        {timerCount} {/* Display the functional timer count */}
                    </h2>
                </div>

                {/* Conditional rendering of the question card based on question.type */}
                {question.type === 'mcq' && (
                    <McqQuestionCard
                        questionData={question}
                        onAnswerSubmit={onAnswerSubmit}
                        currentPlayerProfile={currentPlayerProfile}
                    />
                )}
                {question.type === 'truefalse' && (
                    <TrueFalseQuestionCard
                        questionData={question}
                        onAnswerSubmit={onAnswerSubmit}
                        currentPlayerProfile={currentPlayerProfile}

                    />
                )}
                {question.type === 'fillblank' && (
                    <FillBlankQuestionCard
                        questionData={question}
                        onAnswerSubmit={onAnswerSubmit}
                        currentPlayerProfile={currentPlayerProfile}
                    />
                )}

            </div>
        </section>
    );
};

export default QuestionBox;
