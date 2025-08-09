import React from 'react'
import { PiWarningCircleBold } from "react-icons/pi";

const QuizWarning = () => {
    return (
        <section className='w-full h-auto py-24 px-3 md:px-22 lg:px-44 flex justify-center items-center'>

            {/* warning box */}
            <div className='w-[34rem] h-auto py-12 px-3 md:px-6 text-center bg-white border border-slate-200 rounded-lg flex flex-col gap-4 justify-center items-center'>

                {/* warning icon */}
                <div className='text-5xl text-yellow-400'>
                    <PiWarningCircleBold />
                </div>

                {/* warning text */}
                <p className='text-zinc-500'>
                    Before joining, make sure you have the correct roomId. The quiz must be active, and once you answer, your choice is final. Leaving early might affect your score.
                </p>

            </div>

        </section>
    )
}

export default QuizWarning