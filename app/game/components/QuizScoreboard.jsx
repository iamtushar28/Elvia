import React from "react";
import Image from "next/image"; // Assuming you are using Next.js
import { AiOutlineTrophy } from "react-icons/ai";

const QuizScoreboard = ({ currentPlayers, maxPossibleScore }) => {

    // Define the max height in pixels for the score bar (h-32 is 128px in Tailwind default)
    const maxBarHeightPx = 220;

    // Sort players in descending order by score
    const sortedPlayers = [...currentPlayers].sort(
        (a, b) => (b.score || 0) - (a.score || 0)
    );

    return (
        <div className="game-ended-screen p-4 text-center pt-16">
            <h3 className="text-2xl font-bold text-zinc-800 mb-4">Final Scores:</h3>
            <div className="flex flex-wrap justify-center items-end gap-6 p-4 rounded-lg overflow-x-auto">
                {sortedPlayers.map((user, index) => {

                    // Set a minimum height for the top three ranks to ensure visibility of the trophy and rank
                    const minHeight = index < 3 ? 90 : 1;

                    // Calculate bar height based on score percentage
                    const scorePercentage = maxPossibleScore > 0 ? (user.score || 0) / maxPossibleScore : 0;
                    const barHeight = Math.max(minHeight, Math.round(scorePercentage * maxBarHeightPx)); // Ensure a minimum height of 1px

                    return (
                        <div
                            key={user.userId}
                            className="w-20 h-auto flex flex-col gap-2 justify-center items-center"
                        >
                            {/* Player Avatar */}
                            <div className="flex justify-center items-center">
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    height={70}
                                    width={70}
                                    className="rounded-full"
                                />
                            </div>

                            {/* Score Bar */}
                            <div
                                className="w-full bg-violet-400 rounded-t-lg flex items-end justify-center text-white font-bold text-sm"
                                style={{ height: `${barHeight}px` }}
                            >
                                {/* Display score on the bar if it's tall enough */}
                                {barHeight > 20 &&
                                    <>
                                        <div className='flex flex-col justify-center items-center'>
                                            {/* trophy icon */}
                                            <p>
                                                {index < 3 && (
                                                    <AiOutlineTrophy
                                                        className={`text-3xl ${['text-yellow-400', 'text-zinc-200', 'text-green-300'][index]}`}
                                                    />
                                                )}
                                            </p>
                                            {/* rank */}
                                            <p className={`text-xl font-semibold mb-1 mt-1`} >
                                                {index + 1}
                                                <span className='text-sm'>
                                                    {['st', 'nd', 'rd'][index] || 'th'}
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                }
                            </div>

                            {/* Player Name */}
                            <p className="font-semibold capitalize text-zinc-800 text-center text-sm truncate w-full">
                                {user.name}
                            </p>

                            {/* Player Points */}
                            <p className="-mt-2 text-sm text-zinc-500">
                                {user.score || 0} pts
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizScoreboard;