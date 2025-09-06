import React from 'react'
import AiExplain from './AiExplain';
import { MdDone, MdOutlineAdd } from "react-icons/md";

const ReviewTrueFalse = ({ questionNumber, questionData, playerAnswer, isCorrect }) => {
    return (
        <div className='w-full md:w-[70%] h-fit px-4 py-6 md:p-10 bg-white border border-zinc-200 rounded-2xl flex flex-col gap-6 md:gap-8 relative'>

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
            <div className='flex flex-col gap-4'>

                <button
                    className={`w-full h-fit py-3 px-2 md:px-4 md:py-4 border-1 rounded-xl flex justify-start items-center gap-2 md:gap-4 cursor-pointer transition-all duration-300
                    ${(questionData.correctAnswer == 'True') ? 'border-green-400 bg-green-50/50' :
                            (questionData.correctAnswer != 'True' && playerAnswer == 'True') ?
                                'border-red-400 bg-red-50/50'
                                :
                                'border-zinc-200'
                        }
                    `}>

                    {/* option true */}
                    <div className={`min-h-6 min-w-6 md:min-h-8 md:min-w-8 text-sm md:text-base rounded-full flex justify-center items-center ${questionData.correctAnswer == 'True' ? 'text-white bg-green-500'
                        : (questionData.correctAnswer != 'True' && playerAnswer == 'True') ?
                            'text-white bg-red-500'
                            :
                            'text-zinc-800 border border-zinc-200'
                        }`}>

                        {(questionData.correctAnswer == 'True') ?
                            <MdDone />
                            : (questionData.correctAnswer != 'True' && playerAnswer == 'True') ?
                                <MdOutlineAdd className='rotate-45' />
                                :
                                <p>
                                    T
                                </p>
                        }

                    </div>

                    <div className='w-full flex justify-between items-center'>
                        {/* options */}
                        <p className='text-start'>True</p>

                        {(playerAnswer == 'True') && (<>

                            {questionData.correctAnswer == 'True' ? <p className='text-xs md:text-sm text-green-500 hidden md:block'>Your Answer</p> : <p className='text-xs md:text-sm text-red-500 hidden md:block'>Your Answer</p>}

                        </>)}

                        {questionData.correctAnswer == 'True' && playerAnswer != 'True' && (
                            <p className='text-xs md:text-sm text-green-500 hidden md:block'>Correct Answer</p>
                        )}

                    </div>

                </button>

                <button
                    className={`w-full h-fit py-3 px-2 md:px-4 md:py-4 border-1 rounded-xl flex justify-start items-center gap-2 md:gap-4 cursor-pointer transition-all duration-300
                    ${(questionData.correctAnswer == 'False') ? 'border-green-400 bg-green-50/50' :
                            (questionData.correctAnswer != 'False' && playerAnswer == 'False') ?
                                'border-red-400 bg-red-50/50'
                                :
                                'border-zinc-200'
                        }
                    `}>

                    {/* option False */}
                    <div className={`min-h-6 min-w-6 md:min-h-8 md:min-w-8 text-sm md:text-base rounded-full flex justify-center items-center ${questionData.correctAnswer == 'False' ? 'text-white bg-green-500'
                        : (questionData.correctAnswer != 'False' && playerAnswer == 'False') ?
                            'text-white bg-red-500'
                            :
                            'text-zinc-800 border border-zinc-200'
                        }`}>

                        {(questionData.correctAnswer == 'False') ?
                            <MdDone />
                            : (questionData.correctAnswer != 'False' && playerAnswer == 'False') ?
                                <MdOutlineAdd className='rotate-45' />
                                :
                                <p>
                                    F
                                </p>
                        }

                    </div>

                    <div className='w-full flex justify-between items-center'>
                        {/* options */}
                        <p className='text-start'>False</p>

                        {(playerAnswer == 'False') && (<>

                            {questionData.correctAnswer == 'False' ? <p className='text-xs md:text-sm text-green-500 hidden md:block'>Your Answer</p> : <p className='text-xs md:text-sm text-red-500 hidden md:block'>Your Answer</p>}

                        </>)}

                        {questionData.correctAnswer == 'False' && playerAnswer != 'False' && (
                            <p className='text-xs md:text-sm text-green-500 hidden md:block'>Correct Answer</p>
                        )}

                    </div>

                </button>
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

            {/* get AI Explanation */}
            <AiExplain question={questionData.questionText} correctAnswer={questionData.correctAnswer} />

        </div>
    )
}

export default ReviewTrueFalse