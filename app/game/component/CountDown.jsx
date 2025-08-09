import React from 'react'
import { MdOutlineTimer } from "react-icons/md";

const CountDown = () => {
    return (
        <section className='w-full h-auto py-24 px-3 md:px-22 lg:px-44 flex justify-center items-center'>

            {/* count down box */}
            <div className='w-[34rem] h-auto py-12 px-3 md:px-6 text-center bg-white border border-slate-200 rounded-lg flex flex-col gap-8 justify-center items-center'>

                {/* warning icon */}
                <div className='text-3xl text-yellow-400'>
                    <MdOutlineTimer />
                </div>

                {/* count */}
                <h2 className='text-6xl font-semibold text-violet-500'>
                    3
                </h2>

                <p className='text-zinc-500 -mt-5'>Get ready!</p>

            </div>

        </section>
    )
}

export default CountDown