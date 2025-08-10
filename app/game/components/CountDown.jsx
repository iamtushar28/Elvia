'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { MdOutlineTimer } from "react-icons/md";

const CountDown = () => {
    const [count, setCount] = useState(3); // Initialize countdown from 3
    const [goMessage, setGoMessage] = useState(false); // State to show "Let's go!"

    useEffect(() => {
        // If count is 0, display "Let's go!"
        if (count === 0) {
            setGoMessage(true);
            // No need for further countdown, so return
            return;
        }

        // Set a timer to decrement the count every second
        const timer = setTimeout(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000); // Decrement every 1 second

        // Cleanup function: Clear the timer if the component unmounts
        // or if the effect re-runs before the timer fires (e.g., count changes)
        return () => clearTimeout(timer);
    }, [count]); // Effect runs whenever 'count' changes

    return (
        <section className='w-full h-auto py-24 px-3 md:px-22 lg:px-44 flex justify-center items-center'>
            {/* count down box */}
            <div className='w-[34rem] h-auto py-12 px-3 md:px-6 text-center bg-white border border-slate-200 rounded-lg flex flex-col gap-8 justify-center items-center'>

                {/* warning icon */}
                <div className='text-3xl text-yellow-400'>
                    <MdOutlineTimer />
                </div>

                {/* count or "Let's go!" */}
                <h2 className='text-6xl font-semibold text-violet-500'>
                    {goMessage ? "Let's go!" : count} {/* Display message or count */}
                </h2>

                {goMessage ? " " : <p className='text-zinc-500 -mt-5'>Get ready!</p>}
                {/* <p className='text-zinc-500 -mt-5'>Get ready!</p> */}

            </div>
        </section>
    );
};

export default CountDown;
