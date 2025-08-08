'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoImageOutline } from "react-icons/io5";

const TOTAL_AVATARS = 19;

// Utility function to get a random number between 1 and the total number of avatars
const getRandomAvatarId = () => {
    return Math.floor(Math.random() * TOTAL_AVATARS) + 1;
};

const AvatarSelector = () => {
    const [avatarId, setAvatarId] = useState(1); // Default avatar is set to 1
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

    // This effect runs only once when the component mounts
    // to set a random avatar on initial load.
    useEffect(() => {
        setAvatarId(getRandomAvatarId());
    }, []);

    const handleChangeAvatar = () => {
        // Start the loading state
        setIsLoadingAvatar(true);
        setTimeout(() => {
            let newAvatarId = getRandomAvatarId();

            // Ensure the new avatar is different from the current one
            while (newAvatarId === avatarId) {
                newAvatarId = getRandomAvatarId();
            }

            // Update the avatar ID after the "loading" is complete
            setAvatarId(newAvatarId);

            // End the loading state
            setIsLoadingAvatar(false);
        }, 500); // 500ms delay to simulate network latency or a brief loading time
    };

    return (
        <div className='flex flex-col items-center gap-4'>
            {/* Avatar Display */}
            <div className='h-32 w-32 border-3 border-[#917EC6]/50 text-[#8570C0E6] bg-white rounded-full shadow-lg flex justify-center items-center overflow-hidden'>
                {isLoadingAvatar ? (
                    <div className='flex items-center justify-center h-full w-full text-[2rem] text-[] animate-pulse'>
                        <IoImageOutline />
                    </div>
                ) : (
                    <Image
                        src={`/avatars/avatar-${avatarId}.webp`}
                        alt={`User Avatar ${avatarId}`}
                        width={128}
                        height={128}
                        className='object-cover h-full w-full'
                    />
                )}
            </div>

            {/* Change Avatar Button */}
            <button
                onClick={handleChangeAvatar}
                className='px-4 py-2 text-sm text-[#917EC9] bg-white hover:bg-violet-50 rounded-lg border border-[#917EC9] cursor-pointer transition-all duration-200'
            >
                Change Avatar
            </button>
        </div>
    );
};

export default AvatarSelector;