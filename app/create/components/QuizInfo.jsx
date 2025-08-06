import React from 'react'
import { LuListChecks } from "react-icons/lu";
import { LuTimer } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";

const QuizInfo = () => {
    return (
        <section className='w-full pt-[66px] px-3 md:px-10 lg:px-36 mt-8'>

            {/* quiz info card */}
            <div className='w-full h-auto px-3 md:px-6 py-5 md:py-8 bg-white rounded-lg shadow flex flex-col gap-4 md:gap-6'>

                {/* quiz name */}
                <h2 className='text-lg font-semibold text-[#8570C0]'>Untitled Quiz</h2>

                {/* quiz information */}
                <div className='flex justify-between items-center'>

                    <div className='flex flex-col md:flex-row gap-1 md:gap-4 items-center'>
                        {/* question count */}
                        <h4 className='text-zinc-800 font-[500] text-lg flex items-center gap-2'>
                            <LuListChecks className='text-xl text-[#8570C0]' />
                            Questions: 0
                        </h4>

                        {/* incomplete quiz status count */}
                        <button className='px-2 md:px-3 py-1 text-sm text-red-500 bg-red-50 rounded-2xl'>
                            1 Incomplete
                        </button>
                    </div>

                    {/* total estimate time to complete quiz game */}
                    <h4 className='text-zinc-800 text-xs md:text-base flex gap-1 md:gap-2 items-center'>
                        <LuTimer className='text-xl text-[#8570C0]' />
                        Est. time: 30 sec
                    </h4>
                </div>

                {/* total user join limit indicator */}
                <div className='w-full h-8 md:h-12 px-4 text-xs md:text-sm text-blue-600 bg-blue-50 flex gap-2 justify-start items-center rounded-lg border border-blue-400'>
                    <FiUsers/>
                    Up to 49 players can join your quiz
                </div>

            </div>

        </section>
    )
}

export default QuizInfo