import React from 'react'
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import AnimatedBackground from '@/app/components/AnimatedBackground';
import CreateProfile from './CreateProfile';

const Hero = ({ roomId }) => {
    return (
        <section className='h-[100vh] w-full px-3 flex flex-col gap-8 justify-center items-center relative overflow-hidden'>

            {/* gradient visual */}
            <div className='h-44 w-44 blur-[90px] bg-pink-400/60 rounded-full absolute left-6 top-[20%] -z-10 hidden md:block'></div>
            <div className='h-44 w-44 blur-[90px] bg-blue-400/60 rounded-full absolute left-44 top-[70%] -z-10 hidden md:block'></div>
            <div className='h-44 w-44 blur-[90px] bg-violet-400/60 rounded-full absolute right-6 top-[30%] -z-10 hidden md:block'></div>

            {/* animated background */}
            <div className='block md:hidden'>
                <AnimatedBackground />
            </div>

            {/* go back button */}
            <Link href={'/'} className='h-12 w-12 bg-white hover:bg-zinc-100 rounded-full absolute top-6 left-6 flex justify-center items-center cursor-pointer transition-all duration-200'>
                <FaArrowLeft />
            </Link>

            {/* room name */}
            <button className='px-5 py-2 mb-4 text-[#917EC9] bg-violet-100 rounded-3xl'>
                Room: {roomId ? roomId : 'Loading...'}
            </button>

            {/* create profile component */}
            <CreateProfile />

        </section>
    )
}

export default Hero