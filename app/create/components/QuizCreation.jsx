'use client'
import React, { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form';

import Mcq from './reusable/Mcq'
import TrueFalse from './reusable/TrueFalse'
import FillInBlank from './reusable/FillInBlank'
import { LuBookText } from "react-icons/lu";
import { RiRobot3Line } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import { LuTimer } from "react-icons/lu";

const QuizCreation = () => {

    // --- React Hook Form setup ---
    // Get the form methods from the context provided by FormProvider
    const methods = useFormContext();
    const {
        control,
        register,
        setValue,
        formState: { errors }
    } = methods;

    // The key hook: useFieldArray to manage the dynamic list of questions
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions', // This is the name of our form array
    });

    // --- State for component's UI (not form data) ---
    const [timeLimit, setTimeLimit] = useState(20);
    const [manualCreation, setManualCreation] = useState(true);
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

    // --- Form Handlers ---
    const handleAddQuiz = (type) => {
        // Use `append` from `useFieldArray` to add a new question object
        // The default structure for a new question object
        append({
            type, // This is crucial for rendering and saving
            timeLimit,
            // Include default values for each question type
            questionText: '',
            options: type === 'mcq' ? [{ optionText: '' }, { optionText: '' }, { optionText: '' }, { optionText: '' }] : [], // Ensure 4 options for MCQ
            correctOptionIndex: null,
            correctAnswer: '',
        });
    };

    // --- Quiz Rendering Logic ---
    const renderQuiz = (quiz, number, index) => {
        const handleRemove = () => remove(index);
        const commonProps = {
            quizId: quiz.id, // The `id` from useFieldArray is a unique ID
            number,
            timeLimit: quiz.timeLimit,
            onDelete: handleRemove,
            register,
            errors,
            control,
            setValue,
            index, // Pass the index to register the fields correctly
        };

        switch (quiz.type) {
            case 'mcq':
                return <Mcq {...commonProps} />;
            case 'truefalse':
                return <TrueFalse {...commonProps} />;
            case 'fillblank':
                return <FillInBlank {...commonProps} />;
            default:
                return null;
        }
    };

    const quizTypes = [
        { type: 'mcq', label: 'Multiple Choice', shortLabel: '+ MCQ' },
        { type: 'truefalse', label: '+ True/False', shortLabel: '+ T/F' },
        { type: 'fillblank', label: '+ Fill in Blank', shortLabel: '+ Fill' },
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
                    {/* Add Questions Section */}
                    <div className='w-full h-auto mt-6 px-4 md:px-6 py-8 bg-white rounded-lg shadow flex flex-col gap-2 md:gap-5'>
                        <h2 className='text-lg text-zinc-700'>Add Questions</h2>
                        <div className='flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                            <div className="flex gap-4">
                                {quizTypes.map(({ type, label, shortLabel }) => (
                                    <button
                                        key={type}
                                        onClick={() => handleAddQuiz(type)}
                                        className="cursor-pointer min-w-fit h-fit px-4 py-2 bg-white border border-gray-200 rounded-lg hover:ring-2 hover:ring-violet-400 transition-all duration-200 text-zinc-600 flex gap-2 items-center"
                                    >
                                        <span className="hidden md:block">{label}</span>
                                        <span className="block md:hidden">{shortLabel}</span>
                                    </button>
                                ))}
                            </div>
                            <div className='flex items-center gap-3'>
                                <h2 className='text-xs text-zinc-800 flex gap-1 items-center'>
                                    <LuTimer className='text-[#8570C0] text-lg' />
                                    Time Limit (sec)
                                </h2>
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className='w-20 h-10 px-3 border border-gray-200 outline-none rounded-lg hover:ring-2 hover:ring-violet-400 transition-all duration-200'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quiz Questions Count */}
                    <div className='flex items-center gap-4 mt-6'>
                        <h2 className='text-lg text-zinc-700 font-semibold'>
                            Quiz Questions
                        </h2>
                        <h4 className='h-6 w-6 text-violet-500 bg-violet-100 rounded-full text-center'>
                            {fields.length} {/* Use fields.length for the count */}
                        </h4>
                    </div>

                    {/* Render All Added Quizzes */}
                    <div>
                        {fields.map((quiz, index) => ( // <--- RENDER FROM `fields` ARRAY
                            <div key={quiz.id} className="flex flex-col gap-5">
                                {renderQuiz(quiz, index + 1, index)}
                            </div>
                        ))}
                    </div>


                    {/* Quiz Type Buttons (at the bottom) */}
                    {(fields.length > 0) && (
                        <div className="flex gap-4 mt-5">
                            {quizTypes.map(({ type, label, shortLabel }) => (
                                <button
                                    key={type}
                                    onClick={() => handleAddQuiz(type)}
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