import AnimatedBackground from '@/app/components/AnimatedBackground'
import Link from 'next/link'
import React from 'react'
import ElviaLogo from './ElviaLogo'

const DefaultError = ({ errorMessage }) => {
    return (
        <section className='w-full min-h-screen h-auto px-4 flex flex-col gap-12 justify-center items-center'>

            {/* Animated Background component */}
            <AnimatedBackground />

            {/* Elvia logo component */}
            <ElviaLogo />

            {/* error message card */}
            <div className='w-full md:w-[28rem] h-auto px-4 md:px-12 py-8 bg-white shadow rounded-lg flex flex-col gap-5 justify-center items-center relative group'>

                {/* cat animation */}
                <iframe src="https://lottie.host/embed/01e470b1-58fa-43e8-946e-4acabffc1289/ymLLwubY9D.lottie" className='w-14 h-auto absolute -top-[56.2%] right-0 hidden group-hover:block'></iframe>

                {/* title */}
                <h4 className='text-xl text-red-500 font-semibold'>Error</h4>

                {/* error message */}
                <p className='text-zinc-500 text-center'>{errorMessage}</p>

                <div className='flex gap-4'>

                    {/* Create New Quiz Link */}
                    <Link href={'/create'} className='px-4 py-2 text-white bg-[#8570C0] hover:bg-[#886fcbda] rounded-lg cursor-pointer transition-all duration-300'>
                        Create New Quiz
                    </Link>

                    {/* Join quiz Link */}
                    <Link href={'/'} className='px-4 py-2 text-[#8570C0] bg-white border border-[#8570C0] hover:bg-[#886fcb11] rounded-lg cursor-pointer transition-all duration-300'>
                        Join Quiz
                    </Link>


                </div>

            </div>

        </section>
    )
}

export default DefaultError