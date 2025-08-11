'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';

import { LuTimer } from 'react-icons/lu';
import {
    RiDeleteBinLine,
    RiQuestionLine,
    RiCheckboxCircleLine,
} from 'react-icons/ri';


const Mcq = ({ index, number, timeLimit, onDelete, control, register, setValue }) => {

    // Use useWatch to get the current values of this specific question in the form array
    // The name should be 'questions.INDEX' to match the useFieldArray structure
    const values = useWatch({ control, name: `questions.${index}` });

    // Determine completeness based on the watched values
    const isComplete =
        values?.questionText?.trim() && // getting questionText
        values?.options?.[0]?.optionText?.trim() && // Access options array
        values?.options?.[1]?.optionText?.trim() &&
        values?.options?.[2]?.optionText?.trim() &&
        values?.options?.[3]?.optionText?.trim() &&
        (values?.correctOptionIndex !== null && values?.correctOptionIndex !== undefined); // Check for correct option index

    const handleSelectCorrectAnswer = (optionIndex) => {
        // Use setValue to update the correct option index for this specific question
        setValue(`questions.${index}.correctOptionIndex`, optionIndex, { shouldValidate: true });
    };

    return (
        <div className='w-full h-auto pb-8 mt-6 bg-white rounded-lg border border-violet-300 overflow-hidden'>

            {/* question infoo */}
            <div className='h-20 w-full px-3 md:px-8 bg-violet-50 flex items-center justify-between'>
                <div className='flex gap-4'>
                    <h4 className='h-6 w-6 mt-2 text-violet-500 bg-violet-100 rounded-full text-center'>{number}</h4>

                    {/* // */}
                    <div>
                        <h2 className='text-zinc-900'>Multiple Choice</h2>
                        <p className='text-sm text-zinc-500 flex gap-1 items-center'>
                            <LuTimer />
                            {timeLimit} sec
                        </p>
                    </div>

                    {/* complete/Incomplete indicator */}
                    <button
                        className={`h-fit py-1 px-3 text-xs rounded-xl ${isComplete ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'
                            }`}
                    >
                        {isComplete ? 'Complete' : 'Incomplete'}
                    </button>

                </div>

                {/* delete question button */}
                <button
                    onClick={onDelete}
                    className='h-10 w-10 text-lg hover:text-red-500 hover:bg-red-100 rounded-full transition-all flex justify-center items-center cursor-pointer'
                >
                    <RiDeleteBinLine />
                </button>
            </div>

            {/* Question Input */}
            <div className='px-3 md:px-8 py-4 md:py-6 flex flex-col gap-2'>
                <h2 className='text-zinc-800 flex gap-1 items-center'>
                    <RiQuestionLine className='text-[#8570C0] text-lg' />
                    Question
                </h2>
                <input
                    // Register the question text field using the correct name path
                    {...register(`questions.${index}.questionText`, { required: true })}
                    type='text'
                    placeholder='Enter your question'
                    className='w-full h-10 px-3 border border-zinc-200 outline-none rounded-lg placeholder:text-sm placeholder:text-zinc-500 hover:ring-2 hover:ring-violet-300'
                />

            </div>

            {/* Options */}
            <div className='px-3 md:px-8'>
                <h2 className='text-zinc-800 flex gap-1 items-center'>
                    <RiCheckboxCircleLine className='text-[#8570C0] text-lg' />
                    Options (select correct answer)
                </h2>

                {/* // */}

                <div className='flex flex-col gap-4 mt-5'>
                    {/* Iterate through 4 options */}
                    {[0, 1, 2, 3].map((optIdx) => (
                        <div key={optIdx} className='flex gap-3 items-center'>
                            {/* select option button */}
                            <button
                                type='button'
                                onClick={() => handleSelectCorrectAnswer(optIdx)}
                                className='min-h-5 min-w-5 border border-zinc-300 bg-white rounded-full flex justify-center items-center group cursor-pointer'
                            >
                                <div
                                    className={`h-3 w-3 rounded-full transition-all ${values?.correctOptionIndex === optIdx
                                        ? 'bg-green-500'
                                        : 'group-hover:bg-green-400'
                                        }`}
                                >
                                </div>
                            </button>

                            {/* option input */}
                            <input
                                // Register each option's text field using the correct name path
                                {...register(`questions.${index}.options.${optIdx}.optionText`, { required: true })}
                                type='text'
                                placeholder={`Option ${optIdx + 1}`}
                                className='w-full h-10 px-3 border border-zinc-200 bg-white outline-none rounded-lg placeholder:text-sm placeholder:text-zinc-500 hover:ring-2 hover:ring-violet-300'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mcq;