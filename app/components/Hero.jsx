import Link from 'next/link'
import React from 'react'
import AnimatedBackground from './AnimatedBackground'

const Hero = () => {
    return (
        <section className='w-full h-auto min-h-screen md:max-h-fit py-6 px-4 flex flex-col gap-12 justify-center items-center relative'>

            {/* blob animation */}
            <AnimatedBackground />

            {/* title section */}
            <div className='flex flex-col gap-4 justify-center items-center'>

                {/* dog animation image */}
                <iframe
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    className='h-36'
                    src="https://lottie.host/embed/f4b2a214-a8a6-4eac-9471-a03bf7f63e70/VlMWbTHlQb.lottie">
                </iframe>

                {/* hero title */}
                <h1 className='text-6xl font-bold text-[#8570C0]'>Elvia</h1>

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

                <div className='bg-pink-100'></div>

                <h6 className='text-zinc-500'>Or</h6>

                {/* Create new quiz room button */}
                <Link href={'/create'} className='w-full py-2 text-[#8570C0] border border-[#8570C0] hover:bg-violet-50 rounded-lg cursor-pointer transition-all duration-300 text-center'>
                    + Create New Quiz
                </Link>

            </div>

            {/* footer section */}
            <div className='mt-8 text-center'>
                <button className='text-sm text-zinc-500 hover:text-violet-400 cursor-pointer transition-all duration-300'>How to Play</button>

                <p className='text-zinc-500 mt-2'>Copyright © 2025 | <span className='text-violet-400 cursor-pointer hover:underline'>Elvia</span></p>
            </div>

        </section>
    )
}

export default Hero