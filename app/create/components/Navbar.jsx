import Link from 'next/link';
import React from 'react'
import { PiPlay } from "react-icons/pi";

const Navbar = () => {
    return (
        <nav className='h-[75px] w-full px-3 md:px-10 lg:px-36 bg-white flex justify-between items-center shadow-sm'>

            {/* logo */}
            <h1 className='text-xl font-semibold text-[#8570C0]'>
                Elvia Creator
            </h1>

            {/* start quiz button */}
            <Link href={'/host'} className='px-6 py-2 text-white bg-[#8570C0] rounded-lg cursor-pointer transition-all duration-300 flex gap-3 items-center'>
                <PiPlay />
                Start
            </Link>

        </nav>
    )
}

export default Navbar