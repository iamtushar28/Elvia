import Link from 'next/link';
import React from 'react'
import { PiPlay } from "react-icons/pi";

const Navbar = () => {
    return (
        <nav className='h-[66px] w-full px-2 md:px-8 text-[#8570C0] bg-white flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-sm'>

            {/* logo */}
            <h1 className='text-xl font-semibold'>
                Elvia Creator
            </h1>

            {/* start quiz button */}
            <Link href={'/host'} className='px-4 py-2 bg-[#8570C0] text-white rounded-lg cursor-pointer transition-all duration-300 flex gap-2 items-center'>
                <PiPlay />
                Start
            </Link>

        </nav>
    )
}

export default Navbar