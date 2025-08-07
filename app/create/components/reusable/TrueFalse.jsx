'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateQuiz, setQuizCompleteStatus } from '@/app/reduxStore/quizSlice';

import { LuTimer } from "react-icons/lu";
import { RiDeleteBinLine, RiQuestionLine, RiCheckboxCircleLine } from "react-icons/ri";

const TrueFalse = ({ quizId, number, timeLimit, onDelete }) => {
    const dispatch = useDispatch();

    const [question, setQuestion] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null); // true / false
    const [isComplete, setIsComplete] = useState(false);

    // Update Redux when values change
    useEffect(() => {
        const complete = question.trim() !== '' && selectedAnswer !== null;
        setIsComplete(complete);

        dispatch(updateQuiz({
            id: quizId,
            data: {
                question,
                correctAnswer: selectedAnswer,
                type: 'truefalse',
            },
        }));

        dispatch(setQuizCompleteStatus({
            id: quizId,
            isComplete: complete,
        }));
    }, [question, selectedAnswer]);

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
                        <h2 className='text-zinc-800'>True/False</h2>
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

            {/* question options */}
            <div className='px-3 md:px-8'>
                <h2 className='text-zinc-800 flex gap-1 items-center'>
                    <RiCheckboxCircleLine className='text-[#8570C0] text-lg' />
                    True/False (select correct answer)
                </h2>

                <div className='flex flex-col gap-4 mt-5'>

                    {/* True option */}
                    <button
                        type='button'
                        onClick={() => setSelectedAnswer(true)}
                        className='flex gap-3 items-center group cursor-pointer'
                    >
                        <div className='min-h-5 min-w-5 border border-zinc-300 bg-white rounded-full cursor-pointer flex justify-center items-center'>
                            <div className={`h-3 w-3 rounded-full transition-all duration-200 ${selectedAnswer === true ? 'bg-green-500' : 'group-hover:bg-green-400'
                                }`}></div>
                        </div>
                        <h4 className='h-10 w-full px-4 bg-gray-50 text-start flex items-center rounded'>True</h4>
                    </button>

                    {/* False option */}
                    <button
                        type='button'
                        onClick={() => setSelectedAnswer(false)}
                        className='flex gap-3 items-center group cursor-pointer'
                    >
                        <div className='min-h-5 min-w-5 border border-zinc-300 bg-white rounded-full cursor-pointer flex justify-center items-center'>
                            <div className={`h-3 w-3 rounded-full transition-all duration-200 ${selectedAnswer === false ? 'bg-green-500' : 'group-hover:bg-green-400'
                                }`}></div>
                        </div>
                        <h4 className='h-10 w-full px-4 bg-gray-50 text-start flex items-center rounded'>False</h4>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default TrueFalse;
