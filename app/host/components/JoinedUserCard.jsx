import Image from 'next/image';
import { useEffect, useState } from 'react';

// A helper function to generate a random position
const getRandomPosition = () => {
    // Define the boundaries based on the provided points
    const minTop = 14;
    const maxTop = 78;
    const minLeft = 4;
    const maxLeft = 96;

    // Generate a random top value within the range [14, 78]
    const randomTop = Math.random() * (maxTop - minTop) + minTop;

    // Generate a random left value within the range [4, 96]
    const randomLeft = Math.random() * (maxLeft - minLeft) + minLeft;

    // Return the new random position as a string with percentage
    return {
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
    };
};

const JoinedUserCard = ({ user }) => {
    const [position, setPosition] = useState({ top: '0', left: '0' });

    useEffect(() => {
        // Set a random position when the component is first mounted
        setPosition(getRandomPosition());
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                animation: 'zoomInAndMove 0.5s ease-in-out forwards',
            }}
            className='flex flex-col items-center gap-2'
        >
            {/* user image */}
            <div className='user-bg-blob flex justify-center items-center'>
                <Image
                    src={user.avatar}
                    alt={user.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover z-10"
                />
            </div>

            {/* name */}
            <div className='w-fit px-4 py-1 text-sm md:text-base text-[#8570C0] bg-white rounded-3xl shadow'>
                <p className='capitalize'>{user.name}</p>
            </div>
        </div>
    );
};

export default JoinedUserCard