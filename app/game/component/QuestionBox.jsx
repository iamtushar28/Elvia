import React from 'react'
import TrueFalseQuestionCard from './TrueFalseQuestionCard'
import { LuTimer } from "react-icons/lu";
import McqQuestionCard from './McqQuestionCard';
import FillBlankQuestionCard from './FillBlankQuestionCard';

const QuestionBox = () => {
    return (
        <section className='min-h-screen h-auto pt-20 pb-8 px-4 w-full flex justify-center relative'>

            <div className='w-full md:w-[70%] h-fit flex flex-col gap-6 md:gap-10'>

                <div className='w-full flex justify-between items-center'>
                    {/* title */}
                    <h2 className='text-lg md:text-2xl font-semibold'>Question 1 of 1</h2>

                    {/* quiz timer */}
                    <h2 className='text-lg md:text-2xl font-semibold flex gap-2 items-center'>
                        <LuTimer className='text-[#8570C0E6]' />
                        20
                    </h2>

                </div>

                {/* Question card */}
                {/* <TrueFalseQuestionCard /> */}

                <McqQuestionCard />

                {/* <FillBlankQuestionCard /> */}

            </div>

        </section>
    )
}

export default QuestionBox