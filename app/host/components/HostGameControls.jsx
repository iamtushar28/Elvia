'use client';

import React, { useState } from 'react';
import { FiPlay, FiBarChart2 } from 'react-icons/fi';

const HostGameControls = ({ quizStatus, handleStartQuiz, handleShowResults, isStartButtonEnabled, isShowResultsButtonEnabled }) => {
    const [isStartingQuiz, setIsStartingQuiz] = useState(false);
    const [isShowingResults, setIsShowingResults] = useState(false);

    return (
        <>
            {/* showing start "quiz button" when "quiz state" is waiting */}
            {quizStatus === 'waiting' && (
                <button
                    onClick={() => handleStartQuiz(setIsStartingQuiz)}
                    disabled={!isStartButtonEnabled || isStartingQuiz}
                    className={`
                        px-3 text-sm md:px-4 py-2 text-white bg-[#8570C0] rounded-lg
                        cursor-pointer transition-all duration-300 flex gap-2 items-center
                        ${!isStartButtonEnabled || isStartingQuiz ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8d73d3]'}
                    `}
                >
                    {isStartingQuiz ? 'Starting...' : (
                        <>
                            <FiPlay />
                            Start now
                        </>
                    )}
                </button>
            )}

            {/* showing "show result" button when quiz status is "started" & all players "submitted quiz" */}
            {quizStatus === 'started' && (
                <button
                    onClick={() => handleShowResults(setIsShowingResults)}
                    disabled={!isShowResultsButtonEnabled || isShowingResults}
                    className={`
                         px-3 text-sm md:px-4 py-2 text-white bg-[#8570C0] rounded-lg
                        cursor-pointer transition-all duration-300 flex gap-2 items-center mx-auto
                        ${!isShowResultsButtonEnabled || isShowingResults ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8d73d3]'}
                    `}
                >
                    {isShowingResults ? 'Showing Results...' : (
                        <>
                            <FiBarChart2 />
                            Show Results
                        </>
                    )}
                </button>
            )}

            {/* quiz ended indicator */}
            {quizStatus === 'ended' && (
                <p className=" px-3 text-sm md:px-4 py-2 text-red-500 bg-red-100 rounded-lg">Quiz ended!</p>
            )}
        </>
    );
};

export default HostGameControls;
