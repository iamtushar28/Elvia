'use client'
import React, { useState } from 'react'
import { FiUsers, FiPlay } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import Link from 'next/link';
import AnimatedBackground from '../../components/AnimatedBackground';
import MusicPlayer from './MusicPlayer';

const Hero = ({ roomId }) => {

    const [copiedStatus, setCopiedStatus] = useState(false); // New state for copied indicator

    const handleCopyRoomId = () => {
        if (roomId) {
            // Create a temporary textarea element to copy text
            const el = document.createElement('textarea');
            el.value = roomId;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy'); // Execute copy command
            document.body.removeChild(el); // Remove temporary element

            // Set copied status to true and reset after 4 seconds
            setCopiedStatus(true);
            setTimeout(() => {
                setCopiedStatus(false);
            }, 4000); // Display "Copied!" for 4 seconds
        }
    };

    return (
        <section className='w-full h-auto min-h-[100vh] flex gap-3 flex-col justify-center items-center relative'>

            {/* blob animation */}
            <AnimatedBackground />

            {/* total player */}
            <div className='w-full absolute right-2 md:right-4 top-22 flex flex-col gap-3 items-end'>

                <div className='w-fit px-4 py-1 text-sm md:text-base text-[#8570C0] bg-white rounded-3xl shadow'>
                    <p>Players: 2 / 49</p>
                </div>

                {/* game pin */}
                <button
                    onClick={handleCopyRoomId}
                    className='md:hidden text-sm w-fit px-4 py-2 text-[#8570C0] bg-white rounded-3xl shadow flex items-center gap-2 cursor-pointer'>
                    {copiedStatus ? (
                        <span>Copied!</span> // Show "Copied!" text
                    ) : (
                        <>
                            Game PIN : {roomId ? roomId : 'Loading...'}
                            <LuCopy className='text-lg' />
                        </>
                    )}
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
                    <MusicPlayer />

                </div>

                {/* start quiz button */}
                <Link href={'/join'} className='px-3 text-sm md:px-4 py-2 text-white bg-[#8570C0] hover:bg-[#8d73d3] rounded-lg cursor-pointer transition-all duration-300 flex gap-2 items-center'>
                    <FiPlay />
                    Start now
                </Link>


            </div>


        </section>
    )
}

export default Hero