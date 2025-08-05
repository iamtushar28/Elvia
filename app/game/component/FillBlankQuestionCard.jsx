import React from 'react'
import { FaArrowRight } from "react-icons/fa";

const FillBlankQuestionCard = () => {
    return (

        <div className='w-full h-fit p-4 md:p-10 bg-white border border-zinc-200 rounded-lg flex flex-col gap-6 md:gap-10'>

            {/* question */}
            <h4 className='md:text-lg font-semibold'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam qui nemo a quia veritatis?
            </h4>

            {/* answers */}
            <div className='flex flex-col gap-6'>

                <input type="text" placeholder='Type your answer here...' className='w-full h-14 md:h-16 px-4 border-2 border-zinc-200 hover:border-violet-400 rounded-lg flex justify-start items-center gap-4 outline-none cursor-pointer transition-all duration-300' />

            </div>

            {/* next quetion */}
            <div className='flex justify-end'>
                <button className='w-fit px-6 py-2 text-white bg-violet-500 hover:bg-violet-600 rounded-lg cursor-pointer transition-all duration-300 flex gap-3 items-center'>
                    Next
                    <FaArrowRight />
                </button>
            </div>

        </div>
    )
}

export default FillBlankQuestionCard