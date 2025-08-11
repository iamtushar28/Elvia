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
        const newPositionedUsers = [...positionedUsers];
        let changed = false;

        joinedUsers.forEach(user => {
            const existingPositionedUser = newPositionedUsers.find(pu => pu.userId === user.userId);

            if (!existingPositionedUser) {
                let newPosition;
                let overlap = true;
                let attempts = 0;
                const MAX_ATTEMPTS = 50;

                while (overlap && attempts < MAX_ATTEMPTS) {
                    newPosition = getRandomPositionInBoundary();
                    overlap = checkOverlap(newPosition, newPositionedUsers);
                    attempts++;
                }

                if (!overlap) {
                    newPositionedUsers.push({ ...user, position: { top: `${newPosition.top}%`, left: `${newPosition.left}%` } });
                    changed = true;
                } else {
                    console.warn(`Could not find non-overlapping position for user ${user.name} after ${MAX_ATTEMPTS} attempts.`);
                    newPositionedUsers.push({ ...user, position: { top: `${newPosition.top}%`, left: `${newPosition.left}%` } });
                    changed = true;
                }
            }
        });

        if (changed || newPositionedUsers.length !== positionedUsers.length) {
            setPositionedUsers(newPositionedUsers);
        }

    }, [joinedUsers]); // Only depends on joinedUsers

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

            {/* dog animation image */}
            <iframe
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className="h-48"
                src="https://lottie.host/embed/f4b2a214-a8a6-4eac-9471-a03bf7f63e70/VlMWbTHlQb.lottie">
            </iframe>
        </>
    );
};

export default HostWaitingArea;
