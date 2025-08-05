'use client'
import React from 'react'
import { RiPlayLargeFill } from "react-icons/ri";
import { FiUsers, FiMusic, FiVolume2, FiPlay } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";

const Hero = () => {
    return (
        <section className='w-full h-screen flex gap-3 flex-col justify-center items-center relative'>

            {/* total player */}
            <div className='w-full absolute right-2 md:right-4 top-22 flex flex-col gap-3 items-end'>

                <div className='w-fit px-4 py-1 text-sm md:text-base text-[#8570C0] bg-white rounded-3xl shadow'>
                    <p>Players: 2 / 49</p>
                </div>

                {/* game pin */}
                <button className='md:hidden text-sm w-fit px-4 py-2 text-[#8570C0] bg-white rounded-3xl shadow flex items-center gap-2 cursor-pointer'>
                    Game PIN : 0FQBGY
                    <LuCopy className='' />
                </button>

            </div>

            {/* title */}
            <h2 className='text-xl text-[#8570C0] font-semibold'>Waiting for players to join</h2>

            {/* description */}
            <p className='text-center text-zinc-600 w-full md:w-[400px] px-3 md:px-0'>Share the game PIN with your players so they can join the quiz.</p>

            {/* dog animation image */}
            <iframe
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className='h-48'
                src="https://lottie.host/embed/f4b2a214-a8a6-4eac-9471-a03bf7f63e70/VlMWbTHlQb.lottie">
            </iframe>

            {/* footer section */}
            <div className='w-full h-16 px-3 md:px-6 bg-white border-t border-violet-200 absolute bottom-0 left-0 right-0 flex justify-between items-center'>

                <div className='flex items-center gap-4 md:gap-6'>
                    {/* players count */}
                    <div className='text-zinc-500 flex gap-2 items-center'>
                        <FiUsers className='text-lg text-[#8570C0]' />
                        <span className='text-lg text-[#8570C0] font-semibold'>0</span>
                        <span className='hidden md:block'>Players</span>
                    </div>

                    {/* devider */}
                    <div className='h-6 border border-zinc-300'></div>

                    {/* background music section */}
                    <div className='flex items-center gap-1 md:gap-2'>

                        {/* music list button */}
                        <button className='px-3 py-2 text-[#8570C0] hover:bg-zinc-100 rounded-lg transition-all duration-300 cursor-pointer flex gap-2 items-center'>
                            <FiMusic />
                            <span className='hidden md:block'>Purrfect Pick</span>
                        </button>

                        {/* music volume button */}
                        <button className='h-fit px-3 py-2 text-xl text-[#8570C0] hover:bg-zinc-100 rounded-lg transition-all duration-300 cursor-pointer flex justify-center items-center'>
                            <FiVolume2 />
                        </button>

                        {/* playe/pause music button */}
                        <button className='px-3 py-2 text-[#8570C0] hover:bg-zinc-100 border border-slate-200 rounded-lg cursor-pointer'>
                            <RiPlayLargeFill className='block md:hidden' />
                            <span className='hidden md:block'>Play</span>
                        </button>

                    </div>
                </div>

                {/* start quiz button */}
                <button className='px-3 text-sm md:px-4 py-2 text-white bg-[#8570C0] rounded-lg cursor-pointer transition-all duration-300 flex gap-2 items-center'>
                    <FiPlay />
                    Start now
                </button>


            </div>


        </section>
    )
}

export default Hero