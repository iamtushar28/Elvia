'use client'
import React, { useState, useEffect } from 'react'
import { updateDoc, doc, collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import Image from 'next/image';
import { FiUsers, FiPlay } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import AnimatedBackground from '../../components/AnimatedBackground';
import MusicPlayer from './MusicPlayer';
import JoinedUserCard from './JoinedUserCard';

// Assuming appId is globally available or passed down
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const Hero = ({ roomId, quizId, joinedUsers, quizName, quizStatus, db, playersFinishedCount, allPlayersFinished, quizQuestions }) => {
    const [copiedStatus, setCopiedStatus] = useState(false);
    const [positionedUsers, setPositionedUsers] = useState([]);

    // Minimum distance to prevent overlaps
    const MIN_DISTANCE = 150;

    // This function checks if a new position is too close to existing users
    const checkOverlap = (newPos, existingUsers) => {
        for (let user of existingUsers) {
            if (user.position) {
                const dx = newPos.left - user.position.left;
                const dy = newPos.top - user.position.top;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < MIN_DISTANCE) {
                    return true;
                }
            }
        }
        return false;
    };

    // Define the getRandomPositionInBoundary function here
    const getRandomPositionInBoundary = () => {
        const minTop = 14;
        const maxTop = 78;
        const minLeft = 4;
        const maxLeft = 96;

        const randomTop = Math.random() * (maxTop - minTop) + minTop;
        const randomLeft = Math.random() * (maxLeft - minLeft) + minLeft;

        return {
            top: `${randomTop}%`,
            left: `${randomLeft}%`,
        };
    };

    // This effect runs whenever a new user joins
    useEffect(() => {
        if (joinedUsers.length > 0) {
            const lastUser = joinedUsers[joinedUsers.length - 1];
            // If the user's position hasn't been calculated yet, do it now
            if (!positionedUsers.find(user => user.userId === lastUser.userId)) {
                let newPosition;
                let overlap = true;

                // Loop to find a valid, non-overlapping position
                while (overlap) {
                    // Generate random positions within the defined boundary
                    newPosition = getRandomPositionInBoundary();
                    overlap = checkOverlap(newPosition, positionedUsers);
                }

                // Add the new user with their calculated position to the state
                setPositionedUsers(prevUsers => [
                    ...prevUsers,
                    { ...lastUser, position: newPosition }
                ]);
            }
        }
    }, [joinedUsers, positionedUsers]);

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


    const [isStartingQuiz, setIsStartingQuiz] = useState(false);
    const [isShowingResults, setIsShowingResults] = useState(false);

    const handleStartQuiz = async () => {
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

        setIsStartingQuiz(true);
        try {
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            await updateDoc(quizRef, {
                status: 'started',
                quizStartedAt: new Date(),
            });
            console.log("Quiz status updated to 'started'.");
        } catch (error) {
            console.error("Error starting quiz:", error);
            alert("Failed to start quiz. Please try again.");
        } finally {
            setIsStartingQuiz(false);
        }
    };

    const handleShowResults = async () => {
        if (!quizId || !db || !quizQuestions || quizQuestions.length === 0) {
            console.error("Cannot show results: Missing quizId, db, or quizQuestions.");
            return;
        }
        if (quizStatus !== 'started') {
            alert("Quiz is not in a state to show results.");
            return;
        }
        if (!allPlayersFinished && joinedUsers.length > 0) {
            const confirmShow = confirm("Not all players have finished. Show results anyway?");
            if (!confirmShow) return;
        }

        setIsShowingResults(true);
        try {
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            const answersCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`, quizId, 'answers');

            const answersSnapshot = await getDocs(answersCollectionRef);
            const allAnswers = answersSnapshot.docs.map(doc => doc.data());

            const updatedJoinedUsers = joinedUsers.map(player => {
                let playerScore = 0;
                const playerAnswers = allAnswers.filter(answer => answer.userId === player.userId);

                quizQuestions.forEach(question => {
                    const questionIdentifier = question.id || question.questionText;
                    const playerAnswer = playerAnswers.find(ans => ans.questionId === questionIdentifier);

                    if (playerAnswer) {
                        let isCorrect = false;
                        if (question.type === 'mcq') {
                            isCorrect = playerAnswer.userAnswer === question.correctOptionIndex;
                        } else if (question.type === 'truefalse') {
                            isCorrect = playerAnswer.userAnswer === question.correctAnswer;
                        } else if (question.type === 'fillblank') {
                            const submittedAnswerString = String(playerAnswer.userAnswer || '').trim().toLowerCase();
                            const correctAnswerString = String(question.correctAnswer || '').trim().toLowerCase();
                            isCorrect = submittedAnswerString === correctAnswerString;
                        }

                        if (isCorrect) {
                            playerScore++;
                        }
                    }
                });

                return { ...player, score: playerScore };
            });

            const updatedJoinedUsersMap = updatedJoinedUsers.reduce((acc, user) => {
                acc[user.userId] = user;
                return acc;
            }, {});

            await updateDoc(quizRef, {
                status: 'ended',
                quizEndedAt: new Date(),
                joinedUsers: updatedJoinedUsersMap,
            });
            console.log("Quiz status updated to 'ended' and scores calculated.");

        } catch (error) {
            console.error("Error showing results:", error);
            alert("Failed to show results. Please try again.");
        } finally {
            setIsShowingResults(false);
        }
    };

    const isStartButtonEnabled = quizStatus === 'waiting' && joinedUsers.length > 0;
    const isShowResultsButtonEnabled = quizStatus === 'started' && allPlayersFinished;

    // Determine the maximum possible score (total number of questions)
    const maxPossibleScore = quizQuestions.length;
    // Define the max height in pixels for the score bar (h-32 is 128px in Tailwind default)
    const maxBarHeightPx = 128; // Corresponds to h-32


    return (
        <section className='w-full h-auto min-h-[100vh] flex gap-3 flex-col justify-center items-center relative'>

            {/* blob animation */}
            <AnimatedBackground />

            {/* total player */}
            <div className='w-full absolute right-2 md:right-4 top-22 flex flex-col gap-3 items-end'>

                <div className='w-fit px-4 py-1 text-xs md:text-base text-[#8570C0] bg-white rounded-3xl shadow'>
                    <p>Quiz Name: {quizName}</p>
                </div>


                {/* game pin */}
                <button
                    onClick={handleCopyRoomId}
                    className='md:hidden text-sm w-fit px-4 py-2 text-[#8570C0] bg-white rounded-3xl shadow flex items-center gap-2 cursor-pointer'>
                    {copiedStatus ? (
                        <span>Copied!</span> // Show "Copied!" text
                    ) : (
                        <>
                            Game PIN : {roomId ? roomId : 'Loading...'}
                            <LuCopy className='text-lg' />
                        </>
                    )}
                </button>

            </div>

            {/* Display joined users here */}
            <div className={`mb-8 ${quizStatus === 'ended' ? 'hidden' : ''}`}>
                {joinedUsers.length === 0 ? (
                    <>
                        {/* title */}
                        <h2 className='text-center text-xl text-[#8570C0] font-semibold'>Waiting for players to join</h2>

                        {/* description */}
                        <p className='text-center text-zinc-600 w-full md:w-[400px] px-3 md:px-0'>Share the game PIN with your players so they can join the quiz.</p>
                    </>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {positionedUsers.map(user => (
                            <JoinedUserCard key={user.userId} user={user} position={user.position} />
                        ))}
                    </div>
                )}
            </div>

            {/* dog animation image */}
            <iframe
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className={`h-48 ${quizStatus === 'ended' ? 'hidden' : ''}`}
                src="https://lottie.host/embed/f4b2a214-a8a6-4eac-9471-a03bf7f63e70/VlMWbTHlQb.lottie">
            </iframe>

            {quizStatus === 'started' && (
                <div className="text-center">
                    <p className="text-xl font-bold text-green-600 mb-4">Quiz is in progress!</p>
                    <p className="text-zinc-700 mb-4">
                        Players finished: {playersFinishedCount} / {joinedUsers.length}
                    </p>
                    <button
                        onClick={handleShowResults}
                        disabled={!isShowResultsButtonEnabled || isShowingResults}
                        className={`
                                px-4 py-2 text-white bg-blue-500 rounded-lg
                                cursor-pointer transition-all duration-300 flex gap-2 items-center mx-auto
                                ${!isShowResultsButtonEnabled || isShowingResults ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
                            `}
                    >
                        {isShowingResults ? 'Showing Results...' : (
                            <>
                                {/* <FiBarChart2 /> */}
                                Show Results
                            </>
                        )}
                    </button>
                </div>
            )}

            {quizStatus === 'ended' && (
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-zinc-800 mb-4">Final Scores:</h3>

                    <div className='flex gap-4 justify-center items-end'>
                        {joinedUsers.sort((a, b) => (b.score || 0) - (a.score || 0)).map(user => {
                            // Calculate bar height based on score
                            const scorePercentage = maxPossibleScore > 0 ? (user.score || 0) / maxPossibleScore : 0;
                            const barHeight = Math.max(1, Math.round(scorePercentage * maxBarHeightPx)); // Ensure min height of 1px

                            return (
                                <div key={user.userId} className='w-20 h-auto flex flex-col gap-2 justify-center items-center'>

                                    {/* avatar */}
                                    <div className='flex justify-center items-center'>
                                        <img src={user.avatar} alt={user.name} height={70} width={70} className="rounded-full" />
                                    </div>

                                    {/* score bar */}
                                    <div
                                        className='w-full bg-violet-400 rounded-t-lg flex items-end justify-center text-white font-bold text-sm'
                                        style={{ height: `${barHeight}px` }} // Apply dynamic height
                                    >
                                        {/* Optional: Display score on the bar if it's tall enough */}
                                        {barHeight > 20 && (user.score || 0)}
                                    </div>

                                    {/* name */}
                                    <p className='font-semibold text-zinc-800 text-center text-sm truncate w-full'>{user.name}</p>

                                    {/* points */}
                                    <p className='-mt-2 text-sm text-zinc-500'>{user.score || 0} pts</p>

                                </div>
                            );
                        })}
                    </div>

                </div>
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

                {/* Start Quiz Button */}
                {/* Show only if quiz is in 'waiting' state */}
                {quizStatus === 'waiting' && (
                    <button
                        onClick={handleStartQuiz}
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

                {/* Message if quiz has already started or ended */}
                {quizStatus === 'started' && (
                    <p className="text-sm font-bold text-green-600">Quiz started!</p>
                )}
                {quizStatus === 'ended' && (
                    <p className="font-bold text-red-600 text-sm">Quiz ended!</p>
                )}


            </div>


        </section >
    )
}

export default Hero