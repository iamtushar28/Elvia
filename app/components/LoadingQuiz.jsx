import React from 'react'
import { RiLoader2Fill } from "react-icons/ri"; //loading icon
import AnimatedBackground from './AnimatedBackground';


const LoadingQuiz = () => {
    return (
        <section className='h-screen w-full flex flex-col gap-4 justify-center items-center'>

            {/* Animated Background component */}
            <AnimatedBackground />

            {/* hero title */}
            <h1 className='text-6xl font-bold text-[#8570C0]'>Elvia</h1>

            {/* loading spinner */}
            <div>
                <RiLoader2Fill className="text-4xl text-violet-500 animate-spin" />
            </div>

        </section>
    )
}

export default LoadingQuiz