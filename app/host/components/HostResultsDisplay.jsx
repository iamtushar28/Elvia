'use client';

import React from 'react';
import Image from 'next/image'; // Ensure Image is imported

const HostResultsDisplay = ({ joinedUsers, maxPossibleScore }) => {

    // Define the max height in pixels for the score bar (h-32 is 128px in Tailwind default)
    const maxBarHeightPx = 200;

    return (
        <div className="text-center">

            <h3 className="text-xl font-bold text-zinc-800 mb-4">Final Scores</h3>
            <div className="flex flex-wrap justify-center items-end gap-6">
                {joinedUsers.sort((a, b) => (b.score || 0) - (a.score || 0)).map(user => {

                    // Calculate bar height based on score
                    const scorePercentage = maxPossibleScore > 0 ? (user.score || 0) / maxPossibleScore : 0;
                    const barHeight = Math.max(1, Math.round(scorePercentage * maxBarHeightPx)); // Ensure min height of 1px

                    return (
                        <div key={user.userId} className='w-20 h-auto flex flex-col gap-2 justify-center items-center'>

                            {/* avatar */}
                            <div className='flex justify-center items-center'>
                                <Image src={user.avatar} alt={user.name} height={70} width={70} className="rounded-full" />
                            </div>

                            {/* score bar */}
                            <div
                                className='w-full bg-violet-400 rounded-t-lg flex items-end justify-center text-white font-bold text-sm'
                                style={{ height: `${barHeight}px` }} // Apply dynamic height
                            >
                                {/* Optional: Display score on the bar if it's tall enough */}
                                {barHeight > 20 && (user.score || 0)}
                            </div>

                            {/* name */}
                            <p className='font-semibold capitalize text-zinc-800 text-center text-sm truncate w-full'>{user.name}</p>

                            {/* points */}
                            <p className='-mt-2 text-sm text-zinc-500'>{user.score || 0} pts</p>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HostResultsDisplay;
