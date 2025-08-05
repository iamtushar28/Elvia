import React from 'react'

const Navbar = () => {
    return (
        <nav className='h-[70px] w-full px-3 md:px-22 lg:px-44 flex justify-between items-center'>

            {/* logo */}
            <div className='flex gap-2 items-center'>

                <h1 className='text-xl font-semibold'>
                    Elvia Creator
                </h1>

            </div>

            {/* room id */}
            <button className='py-2 px-3 text-sm md:font-semibold bg-violet-100 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200'>
                Room ID : 0FQBGY
            </button>

        </nav>
    )
}

export default Navbar