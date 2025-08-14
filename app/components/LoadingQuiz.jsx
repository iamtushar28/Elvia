import React from 'react'
import { RiLoader2Fill } from "react-icons/ri"; //loading icon
import AnimatedBackground from './AnimatedBackground';
import ElviaLogo from './ElviaLogo';


const LoadingQuiz = () => {
    return (
        <section className='h-screen w-full flex flex-col gap-4 justify-center items-center'>

            {/* Animated Background component */}
            <AnimatedBackground />

            {/* hero title */}
            <ElviaLogo />

            {/* loading spinner */}
            <div>
                <RiLoader2Fill className="text-4xl text-violet-500 animate-spin" />
            </div>

        </section>
    )
}

export default LoadingQuiz