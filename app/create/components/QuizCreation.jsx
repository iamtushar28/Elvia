'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addQuiz, removeQuiz } from '@/app/reduxStore/quizSlice';

import Mcq from './reusable/Mcq'
import TrueFalse from './reusable/TrueFalse'
import FillInBlank from './reusable/FillInBlank'
import { LuBookText } from "react-icons/lu";
import { RiRobot3Line } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import { LuTimer } from "react-icons/lu";

const QuizCreation = () => {

    const dispatch = useDispatch();

    // Access all quiz items from Redux store
    const quizzes = useSelector((state) => state.quizzes.items);

    // Render quiz creation component based on type
    const renderQuiz = (quiz, number) => {

        const handleRemove = () => dispatch(removeQuiz(quiz.id));

        switch (quiz.type) {
            case 'mcq':
                return <Mcq quizId={quiz.id} number={number} timeLimit={quiz.timeLimit} onDelete={handleRemove} />;
            case 'truefalse':
                return <TrueFalse quizId={quiz.id} number={number} timeLimit={quiz.timeLimit} onDelete={handleRemove} />;
            case 'fillblank':
                return <FillInBlank quizId={quiz.id} number={number} timeLimit={quiz.timeLimit} onDelete={handleRemove} />;
            default:
                return null;
        }
    };

    //time limit of quiz
    const [timeLimit, setTimeLimit] = useState(20); // default to 20 seconds

    // Controls visibility of manual quiz creation block
    const [manualCreation, setManualCreation] = useState(true);

    // Controls visibility of AI-generated quiz creation block
    const [aiGeneration, setAIGeneration] = useState(false);

    // Handles manual button click
    const handleManualClick = () => {
        setManualCreation(true);
        setAIGeneration(false);
    };

    // Handles AI button click
    const handleAIClick = () => {
        setAIGeneration(true);
        setManualCreation(false);
    };

    // quiz creation buttons
    const quizTypes = [
        {
            type: 'mcq',
            label: 'Multiple Choice',
            shortLabel: '+ MCQ',
        },
        {
            type: 'truefalse',
            label: '+ True/False',
            shortLabel: '+ T/F',
        },
        {
            type: 'fillblank',
            label: '+ Fill in Blank',
            shortLabel: '+ Fill',
        },
    ];

    return (
        <section className='w-full px-3 md:px-10 lg:px-36 mt-8 mb-20'>

            {/* quiz creation method manual/ai-genaration */}
            <div className='w-full h-14 px-2 bg-zinc-50 rounded-lg flex justify-between items-center'>

                {/* manual quiz genaration button */}
                <button
                    onClick={handleManualClick}
                    className={`w-[50%] h-10 text-sm md:text-base ${manualCreation ? 'text-white bg-[#8570C0]' : 'text-zinc-600'} rounded-lg cursor-pointer flex justify-center items-center gap-2`}>
                    <LuBookText className='text-lg' />
                    Manual Creation
                </button>

                {/* ai quiz genaration button */}
                <button
                    onClick={handleAIClick}
                    className={`w-[50%] h-10 text-sm md:text-base ${aiGeneration ? 'text-white bg-[#8570C0]' : 'text-zinc-600'} rounded-lg cursor-pointer flex justify-center items-center gap-2`}>
                    <RiRobot3Line className='text-xl' />
                    AI Generation
                </button>

            </div>

            {/* ai promt section */}
            {aiGeneration && (
                <div className='w-full h-auto mt-6 px-3 md:px-6 py-6 md:py-8 bg-white rounded-lg shadow flex gap-5 flex-col'>

                    {/* title */}
                    <div className='flex gap-2'>
                        <RiRobot3Line className='text-[#8570C0] text-3xl md:text-2xl mt-1' />
                        <div>
                            <h2 className='text-lg text-zinc-700'>
                                Generate Questions with AI
                            </h2>
                            <p className='text-zinc-500 text-sm'>Paste content about a topic, and our AI will generate quiz questions for you.</p>
                        </div>
                    </div>

                    <textarea name="prompt" id="prompt" placeholder='Paste content about your topic here...' rows={5} className='p-4 w-full border border-zinc-300 outline-none rounded-lg placeholder:text-zinc-400 hover:ring-2 hover:ring-violet-400'></textarea>

                    {/* genarate questions button */}
                    <button className='w-fit px-4 py-2 text-white bg-[#8570C0] rounded-lg cursor-pointer transition-all duration-300 flex gap-2 items-center'>
                        <BsStars />
                        Generate Questions
                    </button>

                </div>
            )}

            {manualCreation && (
                <>
                    {/* add questions section */}
                    <div className='w-full h-auto mt-6 px-4 md:px-6 py-8 bg-white rounded-lg shadow flex flex-col gap-2 md:gap-5'>

                        {/* quiz name */}
                        <h2 className='text-lg text-zinc-700'>Add Questions</h2>

                        <div className='flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>

                            {/* questions type */}
                            <div className="flex gap-4">
                                {quizTypes.map(({ type, label, shortLabel }) => (
                                    <button
                                        key={type}
                                        onClick={() => dispatch(addQuiz({ type, timeLimit }))}
                                        className="cursor-pointer min-w-fit h-fit px-4 py-2 bg-white border border-gray-200 rounded-lg hover:ring-2 hover:ring-violet-400 transition-all duration-200 text-zinc-600 flex gap-2 items-center"
                                    >
                                        <span className="hidden md:block">{label}</span>
                                        <span className="block md:hidden">{shortLabel}</span>
                                    </button>
                                ))}
                            </div>

                            {/* time limit for question */}
                            <div className='flex items-center gap-3'>
                                <h2 className='text-xs text-zinc-800 flex gap-1 items-center'>
                                    <LuTimer className='text-[#8570C0] text-lg' />
                                    Time Limit (sec)
                                </h2>
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className='w-20 h-10 px-3 border border-gray-200 outline-none rounded-lg hover:ring-2 hover:ring-violet-400 transition-all duration-200' />
                            </div>

                        </div>

                    </div>

                    {/* quiz questions count */}
                    <div className='flex items-center gap-4 mt-6'>
                        <h2 className='text-lg text-zinc-700 font-semibold'>
                            Quiz Questions
                        </h2>

                        {/* questions count */}
                        <h4 className='h-6 w-6 text-violet-500 bg-violet-100 rounded-full text-center'>
                            {quizzes.length}
                        </h4>
                    </div>

                    {/* Render All Added Quizzes */}
                    <div>
                        {quizzes.map((quiz, index) => (
                            <div key={quiz.id} className="flex flex-col gap-5">
                                {renderQuiz(quiz, index + 1)}
                            </div>
                        ))}
                    </div>

                    {/* questions type for easily reach */}
                    {(quizzes.length > 0) && (
                        <div className="flex gap-4 mt-5">
                            {quizTypes.map(({ type, label, shortLabel }) => (
                                <button
                                    key={type}
                                    onClick={() => dispatch(addQuiz({ type, timeLimit }))}
                                    className="cursor-pointer min-w-fit h-fit px-4 py-2 bg-white border border-gray-200 rounded-lg hover:ring-2 hover:ring-violet-400 transition-all duration-200 text-zinc-600 flex gap-2 items-center"
                                >
                                    <span className="hidden md:block">{label}</span>
                                    <span className="block md:hidden">{shortLabel}</span>
                                </button>
                            ))}
                        </div>
                    )}

                </>
            )}

        </section>
    )
}

export default QuizCreation