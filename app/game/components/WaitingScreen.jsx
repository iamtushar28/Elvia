import React from 'react'
import Image from 'next/image'

const WaitingScreen = ({roomId, currentPlayerProfile}) => {
    return (
        <section className='min-h-screen h-auto w-full px-3 md:px-22 lg:px-44 py-14 flex flex-col gap-6 justify-center items-center'>

            {/* room name */}
            <button className='px-5 py-3 text-[#917EC9] bg-violet-100 rounded-3xl'>
                Room: {roomId}
            </button>

            <div className='h-32 w-32 border-3 border-[#917EC6]/50 text-[#8570C0E6] bg-white rounded-full shadow-lg flex justify-center items-center overflow-hidden'>

                {/* profile image */}
                <Image
                    src={currentPlayerProfile.avatar}
                    alt={currentPlayerProfile.name}
                    width={128}
                    height={128}
                    className='object-cover h-full w-full'
                />

            </div>

            {/* name */}
            <div className='text-center -mt-2'>

                <p className='text-[#8570C0E6]'>Your Name</p>

                <h4 className='text-lg font-semibold text-zinc-800'>{currentPlayerProfile.name}</h4>

            </div>

            {/* waiting message */}
            <div className='text-center mt-12'>

                <h2 className='text-xl font-semibold text-zinc-800'>Waiting for Host</h2>
                <p className='text-zinc-500'>The quiz will begin when the host starts the game...</p>

            </div>

            {/* dog animation image */}
            <iframe
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className='h-48 w-auto -mt-8'
                src="https://lottie.host/embed/f4b2a214-a8a6-4eac-9471-a03bf7f63e70/VlMWbTHlQb.lottie">
            </iframe>

        </section>
    )
}

export default WaitingScreen