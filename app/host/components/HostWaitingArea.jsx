'use client';

import React, { useState, useEffect } from 'react';
import JoinedUserCard from './JoinedUserCard';

const HostWaitingArea = ({ joinedUsers }) => {
    // State to hold users with calculated positions
    const [positionedUsers, setPositionedUsers] = useState([]);

    // Minimum distance in percentage to prevent overlaps (adjust as needed)
    const MIN_DISTANCE_PERCENT = 10; // e.g., 10% of container width/height

    // Helper to generate random positions (returns numbers now)
    const getRandomPositionInBoundary = () => {
        const minTop = 15; // Min % from top
        const maxTop = 85;  // Max % from top
        const minLeft = 15; // Min % from left
        const maxLeft = 85; // Max % from left

        const randomTop = Math.random() * (maxTop - minTop) + minTop;
        const randomLeft = Math.random() * (maxLeft - minLeft) + minLeft;

        return {
            top: randomTop, // Return as number
            left: randomLeft, // Return as number
        };
    };

    // Corrected overlap check function (works with numerical percentages)
    const checkOverlap = (newPos, existingUsers) => {
        for (let user of existingUsers) {
            if (user.position) {
                // Parse existing positions to numbers for calculation
                const existingTop = user.position.top;
                const existingLeft = user.position.left;

                const dx = newPos.left - existingLeft;
                const dy = newPos.top - existingTop;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MIN_DISTANCE_PERCENT) {
                    return true;
                }
            }
        }
        return false;
    };

    // Effect to calculate positions for new users
    useEffect(() => {
        setPositionedUsers(prevPositionedUsers => {
            const newPositionedUsers = [];

            // Create a Map for quick lookups of existing users by their userId
            const positionedUsersMap = new Map(prevPositionedUsers.map(user => [user.userId, user]));

            joinedUsers.forEach(user => {
                const existingPositionedUser = positionedUsersMap.get(user.userId);

                if (existingPositionedUser) {
                    // If the user exists, update their data but keep the same position
                    newPositionedUsers.push({
                        ...user,
                        position: existingPositionedUser.position
                    });
                } else {
                    // New user: find a non-overlapping position
                    let newPosition;
                    let overlap = true;
                    let attempts = 0;
                    const MAX_ATTEMPTS = 50;

                    while (overlap && attempts < MAX_ATTEMPTS) {
                        newPosition = getRandomPositionInBoundary();
                        overlap = checkOverlap(newPosition, newPositionedUsers);
                        attempts++;
                    }

                    // If an overlap is still found, use the last generated position
                    newPositionedUsers.push({
                        ...user,
                        position: { top: `${newPosition.top}%`, left: `${newPosition.left}%` }
                    });
                }
            });
            return newPositionedUsers;
        });
    }, [joinedUsers]);

    return (
        <>

            {/* Display joined users with dynamic positioning */}
            {joinedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className='text-center text-xl text-[#8570C0] font-semibold'>Waiting for players to join</h2>
                    <p className='text-center text-zinc-600 w-full md:w-[400px] px-3 md:px-0'>Share the game PIN with your players so they can join the quiz.</p>
                </div>
            ) : (
                positionedUsers.map(user => (
                    <JoinedUserCard key={user.userId} user={user} position={user.position} />
                ))
            )}
        </>
    );
};

export default HostWaitingArea;
