import React from 'react'
import { MdDone, MdOutlineAdd } from "react-icons/md";
import AiExplain from './AiExplain';

const ReviewMCQ = ({ questionNumber, questionData, playerAnswer, isCorrect }) => {

  // Map option indexes to letters for display
  const optionLetters = ['A', 'B', 'C', 'D'];


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

      {/* question options */}
      <div className='flex flex-col gap-4'>

        {questionData.options.map((option, index) => (

          <button
            key={index}
            className={`w-full h-fit py-3 px-2 md:px-4 md:py-3 border-1 rounded-xl flex justify-between items-center cursor-pointer 
            ${questionData.correctOptionIndex == index ? 'bg-green-50/50 border-green-500' :
                playerAnswer == index && !isCorrect ? 'bg-red-50/50 border-red-500' : 'border-zinc-200'}`}>

            <div className='flex gap-2 md:gap-4 items-center'>

              {/* options index A/B/C/D */}
              <div className={`min-h-6 min-w-6 md:min-h-8 md:min-w-8 text-sm md:text-base rounded-full border flex justify-center items-center
                ${questionData.correctOptionIndex == index ? 'text-white border-green-500 bg-green-500' :
                  questionData.correctOptionIndex != playerAnswer && playerAnswer == index ? 'text-white border-red-500 bg-red-500'
                    :
                    'border-zinc-200 '}
                `}>

                {questionData.correctOptionIndex == index ?
                  <MdDone />
                  : (questionData.correctOptionIndex != playerAnswer && playerAnswer == index) ?
                    <MdOutlineAdd className='rotate-45' /> :
                    <>{optionLetters[index]}</>
                }

              </div>

              {/* options text */}
              <p className='text-start'>{option.optionText}</p>

            </div>

            {/* user selected answer indicator */}
            {
              playerAnswer == index && (
                index == questionData.correctOptionIndex ? (
                  <p className='text-xs md:text-sm text-green-500 hidden md:block'>Your Answer</p>
                ) : (
                  <p className='text-xs md:text-sm text-red-500 hidden md:block'>Your Answer</p>
                )
              )
            }

            {
              index == questionData.correctOptionIndex && playerAnswer != index && (
                <p className='text-xs md:text-sm text-green-500 hidden md:block'>Correct Answer</p>
              )
            }

          </button>

        ))}

      </div>

      {/* correct/incorrect answer indicator */}
      <div className={`w-fit px-2 py-1 text-xs rounded-2xl flex gap-1 items-center absolute right-2 top-2
      ${isCorrect ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100/80'}
      `}>

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
      <AiExplain
        question={questionData.questionText}
        options={questionData.options.map(o => o.optionText)}
        correctAnswer={questionData.options[questionData.correctOptionIndex]}
      />

    </div>
  )
}

export default ReviewMCQ