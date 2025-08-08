'use client';

import React from 'react'; 
import { useWatch } from 'react-hook-form';

import { LuTimer } from "react-icons/lu";
import { RiDeleteBinLine, RiQuestionLine, RiCheckboxCircleLine } from "react-icons/ri";


const FillInBlank = ({ index, number, timeLimit, onDelete, control, register }) => {
  

    // Use useWatch to get the current values of this specific question in the form array
    // The name should be 'questions.INDEX' to match the useFieldArray structure
    const values = useWatch({ control, name: `questions.${index}` });

    // Determine completeness based on the watched values
    const isComplete =
        values?.questionText?.trim() !== '' &&
        values?.correctAnswer?.trim() !== '';

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
                    // Register the question text field using the correct name path
                    {...register(`questions.${index}.questionText`, { required: true })}
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
                        // Register the correct answer field using the correct name path
                        {...register(`questions.${index}.correctAnswer`, { required: true })}
                        placeholder='Enter the correct answer'
                        className='w-full h-10 px-3 border border-zinc-200 outline-none rounded-lg placeholder:text-sm placeholder:text-zinc-500 hover:ring-2 hover:ring-violet-300'
                    />
                </div>
            </div>

        </div>
    );
};

export default FillInBlank;