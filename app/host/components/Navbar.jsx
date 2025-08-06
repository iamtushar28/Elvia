import React from 'react'
import { LuCopy } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className='h-[66px] w-full px-2 md:px-8 text-white bg-[#8570C0E6] flex justify-between items-center absolute top-0 left-0 right-0 z-50'>

            {/* logo */}
            <div className='flex gap-2 items-center'>

                {/* back button */}
                <Link href={'/create'} className='p-2 text-xl font-semibold hover:bg-white/20 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-200'>
                    <IoArrowBackOutline />
                </Link>

                <h1 className='text-xl font-semibold'>
                    Elvia Creator
                </h1>

            </div>

            <div className='md:flex gap-4 hidden'>

                {/* join url */}
                <button className='py-2 px-3 font-semibold bg-white/20 hover:bg-white/10 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200'>
                    Join at : stuudle.studocu.com
                    <LuCopy className='text-lg' />
                </button>

                {/* game pin */}
                <button className='py-2 px-3 font-semibold bg-white/20 hover:bg-white/10 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200'>
                    Game PIN : 0FQBGY
                    <LuCopy className='text-lg' />
                </button>

            </div>

        </nav>
    )
}

export default Navbar