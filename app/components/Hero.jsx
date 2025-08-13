import Link from 'next/link'
import React from 'react'
import AnimatedBackground from './AnimatedBackground'
import JoinRoom from './JoinRoom'
import ElviaLogo from './ElviaLogo'

const Hero = () => {
    return (
        <section className='w-full h-auto min-h-screen md:max-h-fit pt-16 pb-6 px-4 flex flex-col gap-12 justify-center items-center relative'>

            {/* blob animation */}
            <AnimatedBackground />

            {/* title section */}
            <div className='flex flex-col gap-4 justify-center items-center'>

                {/* Elvia logo component */}
                <ElviaLogo />

                {/* description */}
                <h4 className='w-full px-3 md:w-[385px] font-[500] text-[#374151] text-center'>An elegant, AI-powered quiz platform for creating, hosting, and joining real-time quizzes solo or with friends. Simple, smart, and interactive.</h4>
            </div>

            {/* create quiz & join quiz section */}
            <div className='w-full md:w-[385px] h-fit px-6 py-8 bg-white shadow rounded-xl flex flex-col gap-4 justify-center items-center'>

                {/* join room component */}
                <JoinRoom />


                <h6 className='text-zinc-500 -mt-3'>Or</h6>

                {/* Create new quiz room button */}
                <Link href={'/create'} className='w-full py-2 text-[#8570C0] border border-[#8570C0] hover:bg-violet-50 rounded-lg cursor-pointer transition-all duration-300 text-center'>
                    + Create New Quiz
                </Link>

            </div>

            {/* footer section */}
            <div className='mt-8 text-center'>
                <Link href={'/how-to-play'} className='text-sm text-zinc-500 hover:text-violet-400 cursor-pointer transition-all duration-300'>How to Play</Link>

                <p className='text-zinc-500 mt-2'>Copyright © 2025 | <span className='text-violet-400 cursor-pointer hover:underline'>Elvia</span></p>
            </div>

        </section>
    )
}

export default Hero