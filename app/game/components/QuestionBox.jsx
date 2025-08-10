'use client';

import React from 'react';
import { LuTimer } from "react-icons/lu";

// Import your specific question card components
import McqQuestionCard from './McqQuestionCard';
import TrueFalseQuestionCard from './TrueFalseQuestionCard';
import FillBlankQuestionCard from './FillBlankQuestionCard';

// QuestionBox now accepts the current question object, its number/total, and the submit handler
const QuestionBox = ({ question, questionNumber, totalQuestions, onAnswerSubmit, currentPlayerProfile }) => {
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
                        <LuTimer className='text-[#8570C0E6]' />
                        {question.timeLimit || 20} {/* Use timeLimit from the current question, default to 20 */}
                    </h2>
                </div>

                {/* Conditional rendering of the question card based on question.type */}
                {question.type === 'mcq' && (
                    <McqQuestionCard
                        questionData={question}
                        onAnswerSubmit={onAnswerSubmit} // <--- Pass it down here!
                        currentPlayerProfile={currentPlayerProfile}
                    />
                )}
                {question.type === 'truefalse' && (
                    <TrueFalseQuestionCard
                        questionData={question}
                        onAnswerSubmit={onAnswerSubmit} // <--- Pass it down here!
                        currentPlayerProfile={currentPlayerProfile}
                    />
                )}
                {question.type === 'fillblank' && (
                    <FillBlankQuestionCard
                        questionData={question}
                        onAnswerSubmit={onAnswerSubmit} // <--- Pass it down here!
                        currentPlayerProfile={currentPlayerProfile}
                    />
                )}

            </div>
        </section>
    );
};

export default QuestionBox;
