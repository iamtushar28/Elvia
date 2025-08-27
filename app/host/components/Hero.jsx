'use client';

import React, { useState } from 'react';
import { FiUsers } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";

// Import new components
import HostWaitingArea from './HostWaitingArea';
import HostQuizInProgress from './HostQuizInProgress'; // <--- Ensure this is imported
import HostResultsDisplay from './HostResultsDisplay';
import HostGameControls from './HostGameControls';
import AnimatedBackground from '../../components/AnimatedBackground';
import MusicPlayer from './MusicPlayer';

// Hero component receives various props to manage and display quiz host view
const Hero = ({
    roomId,
    quizId,
    joinedUsers,
    quizName,
    quizStatus,
    db,
    playersFinishedCount,
    allPlayersFinished,
    quizQuestions
}) => {
    const [copiedStatus, setCopiedStatus] = useState(false);

    // Determine the maximum possible score (total number of questions)
    const maxPossibleScore = quizQuestions.length;

    // Function to handle copying the room ID to the clipboard
    const handleCopyRoomId = () => {
        if (roomId) {
            const el = document.createElement('textarea');
            el.value = roomId;
            document.body.appendChild(el);
            el.select(); // Select the text
            document.execCommand('copy'); // Execute copy command
            document.body.removeChild(el); // Remove the temporary element

            // Set copied status and reset it after 4 seconds
            setCopiedStatus(true);
            setTimeout(() => {
                setCopiedStatus(false);
            }, 4000);
        }
    };

    //edge cases for handling start quiz when no user joined and showing result when all users not submitted quiz
    const isStartButtonEnabled = quizStatus === 'waiting' && joinedUsers.length > 0;
    const isShowResultsButtonEnabled = quizStatus === 'started' && allPlayersFinished;

    return (
        <section className='w-full h-auto min-h-[100vh] flex gap-3 flex-col justify-center items-center relative'>

            {/* Background animation component */}
            <AnimatedBackground />

            {/* Top-right section for quiz name and mobile game PIN */}
            <div className='w-full absolute right-2 md:right-4 top-22 flex flex-col gap-3 items-end'>

                {/* Quiz name display */}
                <div className='w-fit px-4 text-sm py-2 text-[#8570C0] bg-white rounded-3xl shadow'>
                    <p>Quiz Name: <span className='font-semibold'>{quizName}</span></p>
                </div>

                {/* Game PIN button for mobile screens (copies ID to clipboard) */}
                <button
                    onClick={handleCopyRoomId}
                    className='md:hidden text-sm w-fit px-4 py-2 text-[#8570C0] bg-white rounded-3xl shadow flex items-center gap-2 cursor-pointer'>
                    {copiedStatus ? (
                        <span>Copied!</span>
                    ) : (
                        <>
                            Game PIN : {roomId ? <span className='font-semibold'>{roomId}</span> : 'Loading...'}
                            <LuCopy className='text-lg' />
                        </>
                    )}
                </button>

            </div>

            {/* dog animation image */}
            <iframe
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className={`h-48 ${(quizStatus === 'ended') || (joinedUsers.length > 0) ? 'hidden' : ''}`}
                src="https://lottie.host/embed/f4b2a214-a8a6-4eac-9471-a03bf7f63e70/VlMWbTHlQb.lottie">
            </iframe>

            {/* Conditional display area for joined users (hidden when quiz ends) */}
            {(quizStatus === 'waiting' || quizStatus === 'started') && (
                <HostWaitingArea
                    roomId={roomId}
                    quizName={quizName}
                    joinedUsers={joinedUsers}
                    copiedStatus={copiedStatus}
                    handleCopyRoomId={handleCopyRoomId}
                />
            )}

            {/* Render HostQuizInProgress when quiz is started */}
            {quizStatus === 'started' && (
                <HostQuizInProgress
                    playersFinishedCount={playersFinishedCount}
                    joinedUsers={joinedUsers}
                />
            )}

            {/* showing quiz result */}
            {quizStatus === 'ended' && (
                <HostResultsDisplay
                    joinedUsers={joinedUsers}
                    maxPossibleScore={maxPossibleScore}
                />
            )}

            {/* Footer section with players count and music player */}
            <div className='w-full h-16 px-3 md:px-6 bg-white border-t border-violet-200 absolute bottom-0 left-0 right-0 flex justify-between items-center'>

                <div className='flex items-center gap-3 md:gap-6'>
                    {/* Players count display */}
                    <div className='text-zinc-500 flex gap-2 items-center'>
                        <FiUsers className='text-lg text-[#8570C0]' />
                        <span className='text-lg text-[#8570C0] font-semibold'>{joinedUsers.length}</span>
                        <span className='hidden md:block'>Players</span>
                    </div>

                    {/* Separator */}
                    <div className='h-6 border border-zinc-300'></div>

                    {/* Background music player component */}
                    <MusicPlayer />

                </div>

                {/* Render HostGameControls component based on quiz status */}
                {/* This component contains the Start and Show Results buttons */}
                <div>
                    <HostGameControls
                        quizId={quizId}
                        db={db}
                        quizStatus={quizStatus}
                        joinedUsers={joinedUsers}
                        quizQuestions={quizQuestions} // Pass quizQuestions for score calculation
                        playersFinishedCount={playersFinishedCount}
                        allPlayersFinished={allPlayersFinished}
                        isStartButtonEnabled={isStartButtonEnabled}
                        isShowResultsButtonEnabled={isShowResultsButtonEnabled}
                    />
                </div>

            </div>


        </section >
    );
};

export default Hero;
