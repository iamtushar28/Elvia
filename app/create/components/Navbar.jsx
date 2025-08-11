import React from 'react'
import { PiPlay } from "react-icons/pi";
import { RiLoader2Fill } from "react-icons/ri"; //loading icon

const Navbar = ({ onStartQuiz, isStartQuizEnabled, isLoading }) => {
    return (
        <nav className='h-[66px] w-full px-2 md:px-8 text-[#8570C0] bg-white flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-sm'>

            {/* logo */}
            <h1 className='text-xl font-semibold'>
                Elvia Creator
            </h1>

            {/* start quiz button */}
            <button
                onClick={onStartQuiz}
                disabled={!isStartQuizEnabled || isLoading}
                className={`px-4 py-2 bg-[#8570C0] text-white rounded-lg transition-all duration-300 flex gap-2 items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}>

                {isLoading ?
                    <>
                        Starting...  <RiLoader2Fill className='text-lg animate-spin' />
                    </>
                    :
                    <>
                        <PiPlay />
                        Start Quiz
                    </>
                }

            </button>

        </nav>
    )
}

export default Navbar