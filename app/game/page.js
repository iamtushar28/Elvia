'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

// Firebase Imports
import { db } from '../firebase/firebase';
import { doc, onSnapshot, updateDoc, collection, addDoc, increment } from 'firebase/firestore';

// Import your components
import Navbar from "./components/Navbar";
import QuestionBox from "./components/QuestionBox";
import QuizWarning from "./components/QuizWarning";
import CountDown from "./components/CountDown";
import WaitingScreen from "./components/WaitingScreen";
import DefaultError from "../components/DefaultError";
import LoadingQuiz from "../components/LoadingQuiz";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const GameRoomManager = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [roomId, setRoomId] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [quizStatus, setQuizStatus] = useState('waiting');
  const [quizName, setQuizName] = useState('Loading Quiz...');
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [currentPlayerProfile, setCurrentPlayerProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [startPhase, setStartPhase] = useState('none');

  useEffect(() => {
    const rId = searchParams.get('roomId');
    const qId = searchParams.get('_quizId');

    const storedProfile = localStorage.getItem('currentPlayerProfile');
    if (storedProfile) {
      setCurrentPlayerProfile(JSON.parse(storedProfile));
    } else {
      setError("Your player profile is missing. Please join the quiz again.");
      setIsLoadingData(false);
      return;
    }

    if (!rId || !qId) {
      setError("Missing room or quiz ID in URL. Please join or create a quiz.");
      setIsLoadingData(false);
      return;
    }

    setRoomId(rId);
    setQuizId(qId);
    setError(null);

    const quizDocRef = doc(db, `artifacts/${appId}/public/data/quizzes`, qId);

    const unsubscribe = onSnapshot(quizDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const quizData = docSnap.data();
        setQuizName(quizData.quizName || 'Untitled Quiz');
        setQuizStatus(quizData.status || 'waiting');
        setCurrentPlayers(Object.values(quizData.joinedUsers || {}));
        setQuestions(quizData.questions || []);
        setIsLoadingData(false);
        console.log("Game page real-time update:", quizData);
      } else {
        console.log("Quiz document does not exist for ID:", qId);
        setError("This quiz no longer exists or has been deleted.");
        setIsLoadingData(false);
      }
    }, (err) => {
      console.error("Error listening to quiz document:", err);
      setError("Failed to load quiz data in real-time.");
      setIsLoadingData(false);
    });

    return () => unsubscribe();
  }, [searchParams]);

  useEffect(() => {
    let warningTimer;
    let countdownTimer;

    if (quizStatus === 'started') {
      setStartPhase('warning');

      warningTimer = setTimeout(() => {
        setStartPhase('countdown');
      }, 3000);

      countdownTimer = setTimeout(() => {
        setStartPhase('questions');
      }, 3000 + 3000);

    } else if (quizStatus === 'waiting' || quizStatus === 'ended') {
      setStartPhase('none');
      setCurrentQuestionIndex(0);
    }

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(countdownTimer);
    };
  }, [quizStatus]);

  const handleAnswerSubmit = async (questionId, userAnswer) => {
    if (!quizId || !currentPlayerProfile || !currentPlayerProfile.userId) {
      console.error("Cannot submit answer: Missing quizId or currentPlayerProfile.");
      return;
    }

    try {
      const answersCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`, quizId, 'answers');
      const userId = currentPlayerProfile.userId;

      await addDoc(answersCollectionRef, {
        userId: userId,
        questionId: questionId,
        userAnswer: userAnswer,
        submittedAt: new Date(),
      });
      console.log(`Answer for question ${questionId} submitted by ${userId}:`, userAnswer);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        console.log("Player has answered all questions!");
        setStartPhase('finished_player_side');

        const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
        await updateDoc(quizRef, {
          playersFinishedCount: increment(1)
        });
        console.log("Incremented playersFinishedCount in Firestore.");
      }

    } catch (error) {
      console.error("Error submitting answer:", error);
      setError("Failed to submit answer. Please try again.");
    }
  };

  if (error) {
    return <DefaultError errorMessage={error} />;
  }

  if (isLoadingData || !roomId || !quizId || !currentPlayerProfile) {
    return <LoadingQuiz />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Determine the maximum possible score (total number of questions)
  const maxPossibleScore = questions.length;
  // Define the max height in pixels for the score bar (h-32 is 128px in Tailwind default)
  const maxBarHeightPx = 128; // Corresponds to h-32

  return (
    <main className="bg-gradient-to-b from-violet-50 to-white min-h-screen">
      <Navbar roomId={roomId} quizName={quizName} />

      {quizStatus === 'waiting' && (
        <WaitingScreen
          quizName={quizName}
          roomId={roomId}
          currentPlayerProfile={currentPlayerProfile}
          currentPlayers={currentPlayers}
        />
      )}

      {quizStatus === 'started' && (
        <>
          {startPhase === 'warning' && <QuizWarning />}
          {startPhase === 'countdown' && <CountDown />}
          {startPhase === 'questions' && currentQuestion && (
            <QuestionBox
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              onAnswerSubmit={handleAnswerSubmit}
              currentPlayerProfile={currentPlayerProfile}
            />
          )}

          {startPhase === 'finished_player_side' && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">You've finished the quiz!</h2>
              <p className="text-xl text-zinc-700">Waiting for the host to show results.</p>
              {currentPlayerProfile && (
                <div className="mt-4">
                  <Image src={currentPlayerProfile.avatar} alt={currentPlayerProfile.name} width={96} height={96} className="rounded-full mx-auto my-2" />
                  <p className="font-bold text-lg">{currentPlayerProfile.name}</p>
                </div>
              )}
            </div>
          )}

          {startPhase === 'none' && (
             <div className="game-started-screen p-4 text-center">
               <h2 className="text-2xl text-green-600 mb-4">Quiz is starting...</h2>
             </div>
          )}
        </>
      )}

      {quizStatus === 'ended' && (
        <div className="game-ended-screen p-4 text-center">
          <h3 className="text-2xl font-bold text-zinc-800 mb-4">Final Scores:</h3>
          <div className="flex justify-center items-end gap-6 p-4 rounded-lg overflow-x-auto">
              {currentPlayers.sort((a, b) => (b.score || 0) - (a.score || 0)).map(user => {
                  // Calculate bar height based on score
                  const scorePercentage = maxPossibleScore > 0 ? (user.score || 0) / maxPossibleScore : 0;
                  const barHeight = Math.max(1, Math.round(scorePercentage * maxBarHeightPx)); // Ensure min height of 1px

                  return (
                      <div key={user.userId} className='w-20 h-auto flex flex-col gap-2 justify-center items-center'>

                          {/* avatar */}
                          <div className='flex justify-center items-center'>
                              <Image src={user.avatar} alt={user.name} height={70} width={70} className="rounded-full" />
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
    </main>
  );
};

// Main Page component with Suspense boundary
const Page = () => {
  return (
    <>
      <Suspense fallback={<div>Loading quiz page...</div>}>
        <GameRoomManager />
      </Suspense>
    </>
  );
};

export default Page;
