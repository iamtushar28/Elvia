'use client';

import React, { useState } from 'react';
import { FiPlay, FiBarChart2 } from 'react-icons/fi';
import { updateDoc, doc, collection, getDocs } from 'firebase/firestore';
import EndQuizButton from './EndQuizButton';
import { RiLoader2Fill } from "react-icons/ri"; //loading icon

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const HostGameControls = ({
    quizId,
    db,
    quizStatus,
    joinedUsers,
    quizQuestions,
    allPlayersFinished,
    isStartButtonEnabled,
    isShowResultsButtonEnabled
}) => {
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

    return (
        <>
            {/* showing start "quiz button" when "quiz state" is waiting */}
            {quizStatus === 'waiting' && (
                <button
                    onClick={handleStartQuiz}
                    disabled={!isStartButtonEnabled || isStartingQuiz}
                    className={`
                        px-3 text-sm md:text-base md:px-4 py-2 text-white bg-[#8570C0] rounded-lg
                        cursor-pointer transition-all duration-300 flex gap-2 items-center
                        ${!isStartButtonEnabled || isStartingQuiz ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8d73d3]'}
                    `}
                >
                    {isStartingQuiz ?
                        <>
                            Starting
                            <RiLoader2Fill className='text-lg animate-spin' />
                        </>
                        :
                        <>
                            <FiPlay />
                            Start Game
                        </>
                    }
                </button>
            )}

            {/* showing "show result" button when quiz status is "started" & all players "submitted quiz" */}
            {quizStatus === 'started' && (
                <button
                    onClick={handleShowResults}
                    disabled={!isShowResultsButtonEnabled || isShowingResults}
                    className={`
                        px-2 text-sm md:text-base md:px-4 py-2 text-white bg-[#8570C0] rounded-lg
                        cursor-pointer transition-all duration-300 flex gap-2 items-center
                        ${!isShowResultsButtonEnabled || isShowingResults ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8d73d3]'}
                    `}
                >
                    {isShowingResults ?
                        <>
                            Calculating  <RiLoader2Fill className='text-lg animate-spin' />
                        </>
                        :
                        <>
                            <FiBarChart2 />
                            Show Result
                        </>
                    }
                </button>
            )}

            {/* quiz ended indicator */}
            {quizStatus === 'ended' && (
                <EndQuizButton quizId={quizId} db={db} />
            )}
        </>
    );
};

export default HostGameControls;
