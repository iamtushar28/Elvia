import Link from 'next/link'
import React from 'react'

const Hero = () => {
    return (
        <section className='w-full h-screen md:min-h-screen md:max-h-fit py-20 px-4 flex flex-col gap-20 justify-center items-center relative'>

            {/* title section */}
            <div className='flex flex-col gap-6 justify-center items-center'>
                {/* hero title */}
                <h1 className='text-6xl font-bold text-violet-500'>Elvia</h1>

                {/* description */}
                <h4 className='w-full px-3 md:w-[385px] font-[500] text-[#374151] text-center'>An elegant, AI-powered quiz platform for creating, hosting, and joining real-time quizzes solo or with friends. Simple, smart, and interactive.</h4>
            </div>

            {/* create quiz & join quiz section */}
            <div className='w-full md:w-[385px] h-fit px-6 py-8 bg-white shadow rounded-xl flex flex-col gap-4 justify-center items-center'>

                <div className='w-full flex gap-3'>

                    {/* room code input */}
                    <input type="text" placeholder='Enter game PIN' className='w-full p-2 text-center border border-zinc-200 rounded-lg hover:ring-2 hover:ring-violet-300 placeholder:text-[#6B7280] placeholder:text-sm placeholder:text-center outline-none transition-all duration-300' />

                    {/* join quiz room button */}
                    <button className='px-4 py-2 text-white bg-[#8570C0] hover:bg-[#886fcbda] rounded-lg cursor-pointer transition-all duration-300'>
                        Join
                    </button>

                </div>

                <h6 className='text-zinc-500'>Or</h6>

                {/* Create new quiz room button */}
                <Link href={'/create'} className='w-full py-2 text-violet-500 border border-violet-300 hover:bg-violet-50 rounded-lg cursor-pointer transition-all duration-300 text-center'>
                    + Create New Quiz
                </Link>

            </div>

            {/* footer section */}
            <div className='-mt-10 text-center'>
                <button className='text-sm text-zinc-500 hover:text-violet-400 cursor-pointer transition-all duration-300'>How to Play</button>

                <p className='text-zinc-500 mt-2'>Copyright © 2025 | <span className='text-violet-400 cursor-pointer hover:underline'>Elvia</span></p>
            </div>

        </section>
    )
}

export default Hero