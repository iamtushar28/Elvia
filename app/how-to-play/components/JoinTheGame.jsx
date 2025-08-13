import React from 'react'

const JoinTheGame = () => {
    return (
        <div className='w-full h-auto p-6 bg-white shadow-sm rounded-lg flex flex-col gap-3'>

            <h3 className='text-lg font-semibold'>Joining a Game</h3>

            {/* steps */}
            <ol className='text-zinc-700 flex flex-col gap-2'>
                <li>1. Enter the game PIN provided by the host</li>
                <li>2. Enter your name & select your avatar</li>
                <li>3. Wait for the host to start the game</li>
                <li>4. Answer questions as quickly as possible within time</li>
                <li>5. After end quiz wait for result</li>
                <li>6. See your position on the leaderboard after each question</li>
            </ol>

        </div>
    )
}

export default JoinTheGame