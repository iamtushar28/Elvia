import React from 'react'

const CreateTheGame = () => {
    return (
        <div className='w-full h-auto p-6 bg-white shadow-sm rounded-lg flex flex-col gap-3'>

            <h3 className='text-lg font-semibold'>Creating a Game</h3>

            {/* steps */}
            <ol className='text-zinc-700 flex flex-col gap-2'>
                <li>1. Click "Create a Quiz" on the home page</li>
                <li>2. Create your own questions or generate them with AI</li>
                <li>3. Start the game and share the game PIN with players</li>
                <li>4. Show the final results at the end of the game</li>
            </ol>

        </div>
    )
}

export default CreateTheGame