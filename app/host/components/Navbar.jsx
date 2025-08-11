import React, { useState } from 'react'
import { LuCopy } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from 'next/link';

const Navbar = ({ roomId, quizName }) => {

    const [copiedStatus, setCopiedStatus] = useState(false); // New state for copied indicator
    const [copiedUrlStatus, setCopiedUrlStatus] = useState(false); // New state for copied indicator

    // copy url
    const handleCopyUrl = () => {
        // Create a temporary textarea element to copy text
        const el = document.createElement('textarea');
        el.value = 'https://elvia-ai.vercel.app';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy'); // Execute copy command
        document.body.removeChild(el); // Remove temporary element

        // Set copied status to true and reset after 4 seconds
        setCopiedUrlStatus(true);
        setTimeout(() => {
            setCopiedUrlStatus(false);
        }, 4000); // Display "Copied!" for 4 seconds

    };

    // copy room id
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
        <nav className='h-[66px] w-full px-2 md:px-8 text-white bg-[#8570C0E6] flex justify-between items-center absolute top-0 left-0 right-0 z-50'>

            {/* logo */}
            <div className='flex gap-2 items-center'>

                {/* back button */}
                <Link href={'/'} className='p-2 text-xl font-semibold hover:bg-white/20 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-200'>
                    <IoArrowBackOutline />
                </Link>

                <h1 className='text-xl font-semibold'>
                    Elvia Creator
                </h1>

            </div>

            <div className='md:flex gap-4 hidden'>

                {/* join url */}
                <button
                    onClick={handleCopyUrl}
                    className='py-2 px-3 font-semibold bg-white/20 hover:bg-white/10 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200'>
                    {copiedUrlStatus ? (
                        <span>Copied!</span> // Show "Copied!" text
                    ) : (
                        <>
                            Join at : elvia.com
                            <LuCopy className='text-lg' />
                        </>
                    )}
                </button>

                {/* game pin */}
                <button
                    onClick={handleCopyRoomId}
                    className='py-2 px-3 font-semibold bg-white/20 hover:bg-white/10 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200'
                >
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

        </nav>
    )
}

export default Navbar