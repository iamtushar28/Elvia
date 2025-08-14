import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = ({ roomId, quizName }) => {
    return (
        <nav className='h-[70px] w-full px-3 md:px-22 lg:px-32 flex justify-between items-center'>

            {/* logo */}
            <div className='flex gap-2 items-center'>

                {/* logo */}
                <Link href={'/'}>
                    <Image src={'/logo.png'} alt='logo' height={80} width={100} />
                </Link>

            </div>

            <div className='flex gap-3 items-center'>
                {/* room id */}
                <button className='hidden md:flex py-2 px-3 text-xs md:text-sm md:font-semibold bg-violet-100 rounded-lg items-center gap-2 cursor-pointer transition-all duration-200'>
                    Quiz Name : {quizName}
                </button>
                {/* room id */}
                <button className='py-2 px-3 text-xs md:text-sm md:font-semibold bg-violet-100 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200'>
                    Room ID : {roomId}
                </button>
            </div>
        </nav>
    )
}

export default Navbar