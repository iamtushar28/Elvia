'use client'
import React, { useState, useEffect } from 'react'
import { FiUsers, FiPlay } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import Link from 'next/link';
import AnimatedBackground from '../../components/AnimatedBackground';
import MusicPlayer from './MusicPlayer';
import Image from 'next/image';
import JoinedUserCard from './JoinedUserCard';

const Hero = ({ roomId, joinedUsers }) => {
    const [copiedStatus, setCopiedStatus] = useState(false);
    const [positionedUsers, setPositionedUsers] = useState([]);

    // Minimum distance to prevent overlaps
    const MIN_DISTANCE = 150;

    // This function checks if a new position is too close to existing users
    const checkOverlap = (newPos, existingUsers) => {
        for (let user of existingUsers) {
            if (user.position) {
                const dx = newPos.left - user.position.left;
                const dy = newPos.top - user.position.top;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < MIN_DISTANCE) {
                    return true;
                }
            }
        }
        return false;
    };

    // Define the getRandomPositionInBoundary function here
    const getRandomPositionInBoundary = () => {
        const minTop = 14;
        const maxTop = 78;
        const minLeft = 4;
        const maxLeft = 96;

        const randomTop = Math.random() * (maxTop - minTop) + minTop;
        const randomLeft = Math.random() * (maxLeft - minLeft) + minLeft;

        return {
            top: `${randomTop}%`,
            left: `${randomLeft}%`,
        };
    };

    // This effect runs whenever a new user joins
    useEffect(() => {
        if (joinedUsers.length > 0) {
            const lastUser = joinedUsers[joinedUsers.length - 1];
            // If the user's position hasn't been calculated yet, do it now
            if (!positionedUsers.find(user => user.userId === lastUser.userId)) {
                let newPosition;
                let overlap = true;

                // Loop to find a valid, non-overlapping position
                while (overlap) {
                    // Generate random positions within the defined boundary
                    newPosition = getRandomPositionInBoundary();
                    overlap = checkOverlap(newPosition, positionedUsers);
                }

                // Add the new user with their calculated position to the state
                setPositionedUsers(prevUsers => [
                    ...prevUsers,
                    { ...lastUser, position: newPosition }
                ]);
            }
        }
    }, [joinedUsers, positionedUsers]);

    const handleCopyRoomId = () => {
        if (roomId) {
            const el = document.createElement('textarea');
            el.value = roomId;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            setCopiedStatus(true);
            setTimeout(() => {
                setCopiedStatus(false);
            }, 4000);
        }
    };

    return (
        <section className='w-full h-auto min-h-[100vh] flex gap-3 flex-col justify-center items-center relative'>

            {/* blob animation */}
            <AnimatedBackground />

            {/* total player */}
            <div className='w-full absolute right-2 md:right-4 top-22 flex flex-col gap-3 items-end'>

                <div className='w-fit px-4 py-1 text-sm md:text-base text-[#8570C0] bg-white rounded-3xl shadow'>
                    <p>Players: {joinedUsers.length} / 49</p>
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

            {/* Display joined users here */}
            <div className="mb-8">
                {joinedUsers.length === 0 ? (
                    <>
                        {/* title */}
                        <h2 className='text-center text-xl text-[#8570C0] font-semibold'>Waiting for players to join</h2>

                        {/* description */}
                        <p className='text-center text-zinc-600 w-full md:w-[400px] px-3 md:px-0'>Share the game PIN with your players so they can join the quiz.</p>
                    </>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {positionedUsers.map(user => (
                            <JoinedUserCard key={user.userId} user={user} position={user.position} />
                        ))}
                    </div>
                )}
            </div>

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
                        <span className='text-lg text-[#8570C0] font-semibold'>{joinedUsers.length}</span>
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