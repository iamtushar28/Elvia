import React from 'react'

const QuizReviewLoader = () => {
    return (
        <div className='w-full h-auto py-10 px-2 flex flex-col gap-6 justify-center items-center'>

            <h2 className="text-3xl font-bold text-violet-600 my-4">Quiz Review</h2>

            {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className='w-full md:w-[70%] h-fit py-6 px-4 md:p-10 bg-white border border-zinc-200 rounded-lg flex flex-col gap-8 relative animate-pulse'>

                    <div className='w-full h-6 bg-zinc-100 rounded mt-5 md:mt-3'></div>

                    <div className='flex flex-col gap-4'>
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className={`w-full h-fit py-3 px-2 md:px-4 md:py-4 border-1 rounded-lg flex gap-2 justify-between items-center cursor-pointer
                            ${i == 1 ? 'border-green-100' : 'border-zinc-200'}
                            `}>

                                <div className={`min-h-8 min-w-8 rounded-full
                                    ${i == 1 ? 'bg-green-100' : 'bg-zinc-100'}
                                    `}></div>

                                <div className='w-full h-6 bg-zinc-100 rounded'></div>

                            </div>
                        ))}
                    </div>

                    <div className='h-6 w-14 bg-green-100 rounded-3xl absolute top-2 right-2'>
                    </div>

                </div>
            ))}

        </div>
    )
}

export default QuizReviewLoader