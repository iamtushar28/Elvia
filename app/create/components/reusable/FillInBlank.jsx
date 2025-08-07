'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateQuiz, setQuizCompleteStatus } from '@/app/reduxStore/quizSlice';

import { LuTimer } from "react-icons/lu";
import { RiDeleteBinLine, RiQuestionLine, RiCheckboxCircleLine } from "react-icons/ri";

const FillInBlank = ({ quizId, number, timeLimit, onDelete }) => {
    const dispatch = useDispatch();

    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Sync Redux state
    useEffect(() => {
        const complete = question.trim() !== '' && correctAnswer.trim() !== '';
        setIsComplete(complete);

        dispatch(updateQuiz({
            id: quizId,
            data: {
                question,
                correctAnswer,
                type: 'fillblank',
            },
        }));

        dispatch(setQuizCompleteStatus({
            id: quizId,
            isComplete: complete,
        }));
    }, [question, correctAnswer]);

    return (
        <div className='w-full h-auto pb-8 mt-6 bg-white rounded-lg border border-violet-300 overflow-hidden'>

            {/* question info */}
            <div className='h-20 w-full px-3 md:px-8 bg-violet-50 flex items-center justify-between'>

                <div className='flex gap-4'>
                    {/* question number */}
                    <h4 className='h-6 w-6 mt-2 text-violet-500 bg-violet-100 rounded-full text-center'>
                        {number}
                    </h4>

                    {/* question type name & Est. time */}
                    <div>
                        <h2 className='text-zinc-800'>Fill in the Blank</h2>
                        <p className='text-sm text-zinc-500 flex gap-1 items-center'>
                            <LuTimer />
                            {timeLimit} sec
                        </p>
                    </div>

                    {/* complete/incomplete question status */}
                    <button className={`h-fit py-1 px-3 text-xs rounded-xl ${isComplete ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'
                        }`}>
                        {isComplete ? 'Complete' : 'Incomplete'}
                    </button>
                </div>

                {/* delete question button */}
                <button
                    onClick={onDelete}
                    className='h-10 w-10 text-lg hover:text-red-500 hover:bg-red-100 rounded-full cursor-pointer transition-all duration-300 flex justify-center items-center'>
                    <RiDeleteBinLine />
                </button>

            </div>

            {/* question input */}
            <div className='px-3 md:px-8 py-4 md:py-6 flex flex-col gap-2'>
                <h2 className='text-zinc-800 flex gap-1 items-center'>
                    <RiQuestionLine className='text-[#8570C0] text-lg' />
                    Question
                </h2>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder='Enter your question'
                    className='w-full h-10 px-3 border border-zinc-200 outline-none rounded-lg placeholder:text-sm placeholder:text-zinc-500 hover:ring-2 hover:ring-violet-300'
                />
            </div>

            {/* answer input */}
            <div className='px-3 md:px-8'>
                <h2 className='text-zinc-800 flex gap-1 items-center'>
                    <RiCheckboxCircleLine className='text-[#8570C0] text-lg' />
                    Correct Answer
                </h2>

                <div className='mt-2'>
                    <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        placeholder='Enter the correct answer'
                        className='w-full h-10 px-3 border border-zinc-200 outline-none rounded-lg placeholder:text-sm placeholder:text-zinc-500 hover:ring-2 hover:ring-violet-300'
                    />
                </div>
            </div>

        </div>
    );
};

export default FillInBlank;
