'use client';

import React, { useState } from 'react';
import { FiUsers } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { updateDoc, doc, collection, getDocs } from 'firebase/firestore';

// Import new components
import HostWaitingArea from './HostWaitingArea';
import HostQuizInProgress from './HostQuizInProgress';
import HostResultsDisplay from './HostResultsDisplay';
import HostGameControls from './HostGameControls'; // This will contain the start/show results buttons
import AnimatedBackground from '../../components/AnimatedBackground'; // Ensure path is correct
import MusicPlayer from './MusicPlayer'; // Ensure path is correct

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const Hero = ({
    roomId,
    quizId,
    joinedUsers,
    quizName,
    quizStatus,
    db,
    playersFinishedCount,
    allPlayersFinished,
    quizQuestions }) => {
    const [copiedStatus, setCopiedStatus] = useState(false);

    // Determine the maximum possible score (total number of questions)
    const maxPossibleScore = quizQuestions.length;
    // Define the max height in pixels for the score bar (h-32 is 128px in Tailwind default)
    const maxBarHeightPx = 128; // Corresponds to h-32

    // Function to handle copying the room ID to the clipboard
    const handleCopyRoomId = () => {
        if (roomId) {
            const el = document.createElement('textarea');
            el.value = roomId;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            setCopiedStatus(true);
            setTimeout(() => {
                setCopiedStatus(false);
            }, 4000);
        }
    };

    // Function to handle starting the quiz
    const handleStartQuiz = async (setIsStartingQuiz) => {
        // Basic validation checks before starting the quiz
        if (!quizId || !db) {
            console.error("Cannot start quiz: quizId or db instance is missing.");
            return;
        }
        if (joinedUsers.length === 0) {
            alert("Cannot start quiz: No players have joined yet.");
            return;
        }
        if (quizStatus !== 'waiting') {
            alert("Quiz is already started or ended.");
            return;
        }

        setIsStartingQuiz(true); // Set loading state for the button
        try {
            // Reference to the main quiz document in Firestore
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            // Update the quiz status to 'started' and record start time
            await updateDoc(quizRef, {
                status: 'started',
                quizStartedAt: new Date(),
            });

        } catch (error) {
            console.error("Error starting quiz:", error);
            alert("Failed to start quiz. Please try again.");
        } finally {
            setIsStartingQuiz(false); // Reset loading state
        }
    };

    // Function to handle showing quiz results
    const handleShowResults = async (setIsShowingResults) => {
        // Basic validation checks before showing results
        if (!quizId || !db || !quizQuestions || quizQuestions.length === 0) {
            console.error("Cannot show results: Missing quizId, db, or quizQuestions.");
            return;
        }
        if (quizStatus !== 'started') {
            alert("Quiz is not in a state to show results.");
            return;
        }
        // Confirm with host if not all players have finished
        if (!allPlayersFinished && joinedUsers.length > 0) {
            const confirmShow = confirm("Not all players have finished. Show results anyway?");
            if (!confirmShow) return;
        }

        setIsShowingResults(true); // Set loading state for the button
        try {
            // Reference to the main quiz document
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            // Reference to the answers subcollection for the current quiz
            const answersCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`, quizId, 'answers');

            // Fetch all submitted answers for this quiz
            const answersSnapshot = await getDocs(answersCollectionRef);
            const allAnswers = answersSnapshot.docs.map(doc => doc.data());

            // Calculate scores for each player
            const updatedJoinedUsers = joinedUsers.map(player => {
                let playerScore = 0;
                // Filter answers specific to the current player
                const playerAnswers = allAnswers.filter(answer => answer.userId === player.userId);

                // Iterate through each quiz question to check player's answer
                quizQuestions.forEach(question => {
                    // Determine the unique identifier for the question (either id or questionText)
                    const questionIdentifier = question.id || question.questionText;
                    // Find the player's answer for this specific question
                    const playerAnswer = playerAnswers.find(ans => ans.questionId === questionIdentifier);

                    if (playerAnswer) {
                        let isCorrect = false;
                        // Score based on question type
                        if (question.type === 'mcq') {
                            isCorrect = playerAnswer.userAnswer === question.correctOptionIndex;
                        } else if (question.type === 'truefalse') {
                            isCorrect = playerAnswer.userAnswer === question.correctAnswer;
                        } else if (question.type === 'fillblank') {
                            // Convert both submitted and correct answers to lowercase strings for robust comparison
                            const submittedAnswerString = String(playerAnswer.userAnswer || '').trim().toLowerCase();
                            const correctAnswerString = String(question.correctAnswer || '').trim().toLowerCase();
                            isCorrect = submittedAnswerString === correctAnswerString;
                        }

                        if (isCorrect) {
                            playerScore++; // Increment player's score if answer is correct
                        }
                    }
                });

                // Return player object with their calculated score
                return { ...player, score: playerScore };
            });

            // Update the main quiz document with calculated scores and 'ended' status
            // Convert the array of updated player objects back into a map (object) for Firestore storage
            const updatedJoinedUsersMap = updatedJoinedUsers.reduce((acc, user) => {
                acc[user.userId] = user;
                return acc;
            }, {});

            await updateDoc(quizRef, {
                status: 'ended', // Set quiz status to 'ended'
                quizEndedAt: new Date(), // Record quiz end time
                joinedUsers: updatedJoinedUsersMap, // Store updated joinedUsers map with scores
            });


        } catch (error) {
            console.error("Error showing results:", error);
            alert("Failed to show results. Please try again.");
        } finally {
            setIsShowingResults(false);
        }
    };

    // Determine if the "Start now" button should be enabled
    const isStartButtonEnabled = quizStatus === 'waiting' && joinedUsers.length > 0;
    // Determine if the "Show Results" button should be enabled
    const isShowResultsButtonEnabled = quizStatus === 'started' && allPlayersFinished;

    return (
        <section className='w-full h-auto min-h-[100vh] flex gap-3 flex-col justify-center items-center relative'>

            {/* blob animation */}
            <AnimatedBackground />

            {/* quiz info */}
            <div className='w-full absolute right-2 md:right-4 top-22 flex flex-col gap-3 items-end'>

                {/* quiz name */}
                <div className='w-fit px-4 py-1 text-xs md:text-base text-[#8570C0] bg-white rounded-3xl shadow'>
                    <p>Quiz Name: {quizName}</p>
                </div>

                {/* game pin for mobile screen */}
                <button
                    onClick={handleCopyRoomId}
                    className='md:hidden text-sm w-fit px-4 py-2 text-[#8570C0] bg-white rounded-3xl shadow flex items-center gap-2 cursor-pointer'>
                    {copiedStatus ? (
                        <span>Copied!</span>
                    ) : (
                        <>
                            Game PIN : {roomId ? roomId : 'Loading...'}
                            <LuCopy className='text-lg' />
                        </>
                    )}
                </button>

            </div>

            {/* Content based on quiz status */}

            {/* waiting screen when players are joining */}
            {quizStatus === 'waiting' && (
                <HostWaitingArea
                    roomId={roomId}
                    quizName={quizName}
                    joinedUsers={joinedUsers}
                    copiedStatus={copiedStatus}
                    handleCopyRoomId={handleCopyRoomId}
                />
            )}

            {/* quiz progress -> showing players count who submitted quiz */}
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
                    maxBarHeightPx={maxBarHeightPx}
                />
            )}

            {/* footer section */}
            <div className='w-full h-16 px-3 md:px-6 bg-white border-t border-violet-200 absolute bottom-0 left-0 right-0 flex justify-between items-center'>

                <div className='flex items-center gap-4 md:gap-6'>
                    {/* players count */}
                    <div className='text-zinc-500 flex gap-2 items-center'>
                        <FiUsers className='text-lg text-[#8570C0]' />
                        <span className='text-lg text-[#8570C0] font-semibold'>{joinedUsers.length}</span>
                        <span className='hidden md:block'>Players</span>
                    </div>

                    {/* devider */}
                    <div className='h-6 border border-zinc-300'></div>

                    {/* background music section */}
                    <MusicPlayer />

                </div>

                {/* Host Game Controls (Start/Show Results button) */}
                <div>
                    <HostGameControls
                        quizId={quizId}
                        db={db}
                        quizStatus={quizStatus}
                        handleStartQuiz={handleStartQuiz}
                        handleShowResults={handleShowResults}
                        isStartButtonEnabled={isStartButtonEnabled}
                        isShowResultsButtonEnabled={isShowResultsButtonEnabled}
                    />
                </div>

            </div>
        </section >
    );
};

export default Hero;
