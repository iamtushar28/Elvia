import React from 'react'
import Link from 'next/link';
import AvatarSelector from './AvatarSelector'

const CreateProfile = () => {
    return (
        <>
            {/* select avatar component */}
            <AvatarSelector />

            {/* name of player */}
            <div className='w-full flex justify-center'>

                {/* name input */}
                <input type="text" placeholder='Enter your name' className='h-14 w-full bg-white text-center md:w-80 placeholder:text-zinc-400 px-4 border-2 rounded-lg border-violet-300 hover:border-[#917EC9] outline-none transition-all duration-200' />

            </div>

            {/* join button */}
            <Link href={'/game'} className='w-full md:w-80 h-12 text-white bg-[#917EC9] hover:bg-[#9f84ee] rounded-lg cursor-pointer transition-all duration-200 flex justify-center items-center'>
                Join
            </Link>
        </>
    )
}

export default CreateProfile