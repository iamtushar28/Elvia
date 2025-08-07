import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { LuTimer } from 'react-icons/lu';
import { setQuizCompleteStatus } from '@/app/reduxStore/quizSlice';
import {
  RiDeleteBinLine,
  RiQuestionLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';

const Mcq = ({ quizId, number, timeLimit, onDelete, control, register, setValue }) => {
  const dispatch = useDispatch();

  // Watch all quiz values (question, options, correctAnswer)
  const values = useWatch({ control, name: quizId });

  const isComplete =
    values?.question?.trim() &&
    values?.option1?.trim() &&
    values?.option2?.trim() &&
    values?.option3?.trim() &&
    values?.option4?.trim() &&
    values?.correctAnswer;

  useEffect(() => {
    dispatch(setQuizCompleteStatus({ id: quizId, isComplete: !!isComplete }));
  }, [isComplete, dispatch, quizId]);

  const handleSelectCorrectAnswer = (optionKey) => {
    setValue(`${quizId}.correctAnswer`, optionKey);
  };

  return (
    <div className='w-full h-auto pb-8 mt-6 bg-white rounded-lg border border-violet-300 overflow-hidden'>
      {/* Header */}
      <div className='h-20 w-full px-3 md:px-8 bg-violet-50 flex items-center justify-between'>
        <div className='flex gap-4'>
          <h4 className='h-6 w-6 mt-2 text-violet-500 bg-violet-100 rounded-full text-center'>{number}</h4>
          <div>
            <h2 className='text-zinc-900'>Multiple Choice</h2>
            <p className='text-sm text-zinc-500 flex gap-1 items-center'>
              <LuTimer />
              {timeLimit} sec
            </p>
          </div>
          <button
            className={`h-fit py-1 px-3 text-xs rounded-xl ${
              isComplete ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'
            }`}
          >
            {isComplete ? 'Complete' : 'Incomplete'}
          </button>
        </div>
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
          {...register(`${quizId}.question`)}
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
        <div className='flex flex-col gap-4 mt-5'>
          {['option1', 'option2', 'option3', 'option4'].map((optKey, idx) => (
            <div key={optKey} className='flex gap-3 items-center'>
              {/* select option button */}
              <button
                type='button'
                onClick={() => handleSelectCorrectAnswer(optKey)}
                className='min-h-5 min-w-5 border border-zinc-300 bg-white rounded-full flex justify-center items-center group'
              >
                <div
                  className={`h-3 w-3 rounded-full transition-all ${
                    values?.correctAnswer === optKey
                      ? 'bg-green-500'
                      : 'group-hover:bg-green-400'
                  }`}
                ></div>
              </button>

              {/* option input */}
              <input
                {...register(`${quizId}.${optKey}`)}
                type='text'
                placeholder={`Option ${idx + 1}`}
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
