import React from 'react'
import Image from 'next/image'
import Avatar from '@/public/avatar.png'
import { FaArrowLeft } from "react-icons/fa";
import AnimatedBackground from '@/app/components/AnimatedBackground';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className='h-[100vh] w-full px-3 flex flex-col gap-8 justify-center items-center relative overflow-hidden'>

            {/* gradient visual */}
            <div className='h-44 w-44 blur-[90px] bg-pink-400/60 rounded-full absolute left-6 top-[20%] -z-10 hidden md:block'></div>
            <div className='h-44 w-44 blur-[90px] bg-blue-400/60 rounded-full absolute left-44 top-[70%] -z-10 hidden md:block'></div>
            <div className='h-44 w-44 blur-[90px] bg-violet-400/60 rounded-full absolute right-6 top-[30%] -z-10 hidden md:block'></div>

            <div className='block md:hidden'>
                <AnimatedBackground />
            </div>

            {/* go back button */}
            <button className='h-12 w-12 bg-white hover:bg-zinc-100 rounded-full absolute top-6 left-6 flex justify-center items-center cursor-pointer transition-all duration-200'>
                <FaArrowLeft />
            </button>

            {/* room name */}
            <button className='px-5 py-2 mb-4 text-[#917EC9] bg-violet-100 rounded-3xl'>
                Room: 4TKLHP
            </button>

            {/* avatar */}
            <div className='h-28 w-28 border-3 border-[#917EC6]/50 bg-white rounded-full shadow-lg flex justify-center items-center'>
                <Image src={Avatar} alt='Avatar' className='h-28 w-28' />
            </div>

            {/* change avatar */}
            <button className='px-4 py-2 text-sm text-[#917EC9] bg-white hover:bg-violet-50 rounded-lg border border-[#917EC9] cursor-pointer transition-all duration-200'>
                Change Avatar
            </button>

            {/* name of player */}
            <div className='w-full flex justify-center'>

                {/* name input */}
                <input type="text" placeholder='Enter your name' className='h-14 w-full bg-white text-center md:w-80 placeholder:text-zinc-400 px-4 border-2 rounded-lg border-violet-300 hover:border-[#917EC9] outline-none transition-all duration-200' />

            </div>

            {/* join button */}
            <Link href={'/game'} className='w-full md:w-80 h-12 text-white bg-[#917EC9] hover:bg-[#9f84ee] rounded-lg cursor-pointer transition-all duration-200 flex justify-center items-center'>
                Join
            </Link>

        </section>
    )
}

export default Hero