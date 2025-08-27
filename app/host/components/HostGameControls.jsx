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
    isStartButtonEnabled,
    isShowResultsButtonEnabled
}) => {
    const [isStartingQuiz, setIsStartingQuiz] = useState(false); //quiz start loading state
    const [isShowingResults, setIsShowingResults] = useState(false); //show result loading state

    // when clicked at 'start quiz' button this function run for change default status 'waiting' to 'started' for start the game
    const handleStartQuiz = async () => {
        // Input validation: Ensure all necessary data is available before proceeding.
        if (!quizId || !db) {
            console.error("Cannot start quiz: quizId or db instance is missing.");
            return;
        }

        setIsStartingQuiz(true); //set quiz start loading true
        try {
            // Get a reference to the quiz document in the database.
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);

            // Update the quiz document's status to 'started' and record the start time.
            await updateDoc(quizRef, {
                status: 'started',
                quizStartedAt: new Date(),
            });
        } catch (error) {
            console.error("Error starting quiz:", error);
            alert("Failed to start quiz. Please try again.");
        } finally {
            setIsStartingQuiz(false); //set quiz start loading false 
        }

    };

    // Handles showing the quiz results. It calculates scores for all players
    const handleShowResults = async () => {
        // Input validation: Ensure all necessary data is available before proceeding.
        if (!quizId || !db || !quizQuestions || quizQuestions.length === 0) {
            console.error("Cannot show results: Missing quizId, db, or quizQuestions.");
            return;
        }
        setIsShowingResults(true); //set show result loading true 
        try {
            // Get references to the quiz document and the 'answers' sub-collection.
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            const answersCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`, quizId, 'answers');

            // Fetch all player answers from the 'answers' sub-collection.
            const answersSnapshot = await getDocs(answersCollectionRef);
            const allAnswers = answersSnapshot.docs.map(doc => doc.data());

            // Calculate scores for each player by iterating through their answers and comparing them to the correct answers.
            const updatedJoinedUsers = joinedUsers.map(player => {
                let playerScore = 0;

                // Filter answers to only include those from the current player.
                const playerAnswers = allAnswers.filter(answer => answer.userId === player.userId);

                // Loop through each question to check the player's answer.
                quizQuestions.forEach(question => {
                    const questionIdentifier = question.id || question.questionText;
                    const playerAnswer = playerAnswers.find(ans => ans.questionId === questionIdentifier);

                    if (playerAnswer) {
                        let isCorrect = false;
                        // Determine correctness based on the question type.
                        if (question.type === 'mcq') {
                            isCorrect = playerAnswer.userAnswer === question.correctOptionIndex;
                        } else if (question.type === 'truefalse') {
                            isCorrect = playerAnswer.userAnswer === question.correctAnswer;
                            const submittedAnswerString = String(playerAnswer.userAnswer || '').trim().toLowerCase();
                            const correctAnswerString = String(question.correctAnswer || '').trim().toLowerCase();
                            isCorrect = submittedAnswerString === correctAnswerString;
                        } else if (question.type === 'fillblank') {
                            const submittedAnswerString = String(playerAnswer.userAnswer || '').trim().toLowerCase();
                            const correctAnswerString = String(question.correctAnswer || '').trim().toLowerCase();
                            isCorrect = submittedAnswerString === correctAnswerString;
                        }

                        // Increment the score if the answer is correct.
                        if (isCorrect) {
                            playerScore++;
                        }
                    }
                });

                // Return a new player object with the calculated score.
                return { ...player, score: playerScore };
            });

            // Convert the array of updated users into a map for easy storage and access.
            const updatedJoinedUsersMap = updatedJoinedUsers.reduce((acc, user) => {
                acc[user.userId] = user;
                return acc;
            }, {});

            // Update the main quiz document with the 'ended' status, end time, and final player scores.
            await updateDoc(quizRef, {
                status: 'ended',
                quizEndedAt: new Date(),
                joinedUsers: updatedJoinedUsersMap,
            });

        } catch (error) {
            // Log and alert the user if the scoring or update process fails.
            console.error("Error showing results:", error);
            alert("Failed to show results. Please try again.");
        } finally {
            setIsShowingResults(false); //set show result loading false 
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
