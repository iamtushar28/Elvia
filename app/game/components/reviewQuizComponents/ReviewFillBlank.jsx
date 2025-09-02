import React from 'react'
import { MdDone, MdOutlineAdd } from "react-icons/md";

const ReviewFillBlank = ({ questionNumber, questionData, playerAnswer, isCorrect }) => {

    const submittedAnswerString = String(playerAnswer || '').trim().toLowerCase();
    const correctAnswerString = String(questionData.correctAnswer || '').trim().toLowerCase();

    return (
        <div className='w-full md:w-[70%] h-fit px-4 py-6 md:p-10 bg-white border border-zinc-200 rounded-2xl flex flex-col gap-6 md:gap-10 relative'>

            {/* question */}
            <div className='flex gap-2 items-start mt-5 md:mt-3'>

                <h4 className='md:text-lg font-semibold'>
                    {questionNumber}.
                </h4>

                <h4 className='md:text-lg font-semibold'>
                    {questionData.questionText}
                </h4>

            </div>

            {/* answers */}
            <div className='flex flex-col gap-4 md:gap-6'>
                <button
                    className={`w-full h-fit py-3 px-2 md:px-4 md:py-4 border-1 rounded-xl flex justify-start items-center gap-2 md:gap-4 cursor-pointer transition-all duration-300
                    ${submittedAnswerString == correctAnswerString ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'}
                    `}>

                    <div className={`min-h-6 min-w-6 md:min-h-8 md:min-w-8 text-white rounded-full flex justify-center items-center
                        ${submittedAnswerString == correctAnswerString ? 'bg-green-500' : 'bg-red-500'}
                        `}>
                        {submittedAnswerString == correctAnswerString ? <MdDone /> : <MdOutlineAdd className='rotate-45' />}

                    </div>

                    <div className='w-full flex justify-between items-center'>
                        {/* options */}
                        <p className='text-start'>{playerAnswer}</p>

                        <p className={`text-xs md:text-sm ${submittedAnswerString == correctAnswerString ? 'text-green-500' : 'text-red-500'}`}>Your Answer</p>
                    </div>

                </button>

                {!isCorrect && (
                    <button
                        className={`w-full h-fit py-3 px-2 md:px-4 md:py-4 border-1 border-zinc-200 rounded-xl flex justify-start items-center gap-2 md:gap-4 cursor-pointer transition-all duration-300`}>

                        {/* options index A/B/C/D */}
                        <div className={`min-h-6 min-w-6 rounded-full text-white bg-green-500 flex justify-center items-center`}>
                            <MdDone />
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            {/* options */}
                            <p className='text-start'>{questionData.correctAnswer}</p>

                            <p className='text-xs md:text-sm text-green-500'>Correct Answer</p>
                        </div>

                    </button>
                )}

            </div>

            {/* correct/incorrect answer indicator */}
            <div className={`w-fit px-2 py-1 text-xs rounded-2xl flex gap-1 items-center absolute right-2 top-2
                        ${isCorrect ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100/80'}`}>

                {isCorrect ?

                    <>
                        <h6 className='h-4 w-4 text-xs text-green-600 bg-green-300 rounded-full flex justify-center items-center'>
                            <MdDone />
                        </h6>
                        Correct!
                    </>
                    :
                    <>
                        <h6 className='h-4 w-4 text-xs text-red-500 bg-red-200 rounded-full flex justify-center items-center'>
                            <MdOutlineAdd className='rotate-45' />
                        </h6>
                        Incorrect!
                    </>

                }

            </div>

        </div>
    )
}

export default ReviewFillBlank