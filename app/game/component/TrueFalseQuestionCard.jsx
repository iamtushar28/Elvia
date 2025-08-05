import React from 'react'
import { FaArrowRight } from "react-icons/fa";

const TrueFalseQuestionCard = () => {
    return (
        <div className='w-full h-fit p-4 md:p-10 bg-white border border-zinc-200 rounded-lg flex flex-col gap-6 md:gap-10'>

            {/* question */}
            <h4 className='md:text-lg font-semibold'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam qui nemo a quia veritatis?
            </h4>

            {/* answers */}
            <div className='flex flex-col gap-4 md:gap-6'>

                {/* true */}
                <button className='w-full h-14 md:h-16 px-4 border-2 border-zinc-200 hover:bg-violet-50 hover:border-violet-400 rounded-lg flex justify-start items-center gap-4 cursor-pointer transition-all duration-300'>

                    <div className='h-8 w-8 text-violet-400 bg-violet-100 rounded-full flex justify-center items-center'>
                        T
                    </div>

                    True

                </button>

                <button className='w-full h-14 md:h-16 px-4 border-2 border-zinc-200 hover:bg-violet-50 hover:border-violet-400 rounded-lg flex justify-start items-center gap-4 cursor-pointer transition-all duration-300'>

                    <div className='h-8 w-8 text-violet-400 bg-violet-100 rounded-full flex justify-center items-center'>
                        F
                    </div>

                    False

                </button>

                {/* next question */}
                <div className='flex justify-end'>
                    <button className='w-fit px-6 py-2 text-white bg-violet-500 hover:bg-violet-600 rounded-lg cursor-pointer transition-all duration-300 flex gap-3 items-center'>
                        Next
                        <FaArrowRight />
                    </button>
                </div>

            </div>

        </div>
    )
}

export default TrueFalseQuestionCard