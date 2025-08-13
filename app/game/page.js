"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// Firebase Imports
import { db } from "../firebase/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  increment,
} from "firebase/firestore";

// Import your components
import Navbar from "./components/Navbar";
import QuestionBox from "./components/QuestionBox";
import QuizWarning from "./components/QuizWarning";
import CountDown from "./components/CountDown";
import WaitingScreen from "./components/WaitingScreen";
import DefaultError from "../components/DefaultError";
import LoadingQuiz from "../components/LoadingQuiz";
import QuizScoreboard from "./components/QuizScoreboard";
import Link from "next/link";

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// The main component to manage the game room state and logic
const GameRoomManager = () => {
  const searchParams = useSearchParams();

  // State variables for game management
  const [roomId, setRoomId] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [quizStatus, setQuizStatus] = useState("waiting");
  const [quizName, setQuizName] = useState("Loading Quiz...");
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [currentPlayerProfile, setCurrentPlayerProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Manages the different phases of the game start (warning, countdown, questions)
  const [startPhase, setStartPhase] = useState("none");

  // Hook to initialize state and set up a real-time Firestore listener
  useEffect(() => {
    // Get room and quiz IDs from the URL
    const rId = searchParams.get("roomId");
    const qId = searchParams.get("_quizId");

    // Retrieve player profile from local storage
    const storedProfile = localStorage.getItem("currentPlayerProfile");
    if (storedProfile) {
      setCurrentPlayerProfile(JSON.parse(storedProfile));
    } else {
      setError("Your player profile is missing. Please join the quiz again.");
      setIsLoadingData(false);
      return;
    }

    // Handle missing URL parameters
    if (!rId || !qId) {
      setError("Missing room or quiz ID in URL. Please join or create a quiz.");
      setIsLoadingData(false);
      return;
    }

    setRoomId(rId);
    setQuizId(qId);
    setError(null);

    // Set up a real-time listener for the quiz document in Firestore
    const quizDocRef = doc(db, `artifacts/${appId}/public/data/quizzes`, qId);
    const unsubscribe = onSnapshot(
      quizDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const quizData = docSnap.data();
          setQuizName(quizData.quizName || "Untitled Quiz");
          setQuizStatus(quizData.status || "waiting");
          setCurrentPlayers(Object.values(quizData.joinedUsers || {}));
          setQuestions(quizData.questions || []);
          setIsLoadingData(false);
        } else {
          setError("This quiz no longer exists or has been deleted.");
          setIsLoadingData(false);
        }
      },
      (err) => {
        setError("Failed to load quiz data in real-time.");
        setIsLoadingData(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [searchParams]);

  // Effect to manage the game's start sequence
  useEffect(() => {
    let warningTimer;
    let countdownTimer;

    if (quizStatus === "started") {
      setStartPhase("warning");

      warningTimer = setTimeout(() => {
        setStartPhase("countdown");
      }, 4000);

      countdownTimer = setTimeout(() => {
        setStartPhase("questions");
      }, 4000 + 4000);
    } else if (quizStatus === "waiting" || quizStatus === "ended") {
      setStartPhase("none");
      setCurrentQuestionIndex(0); // Reset for new games
    }

    // Clean up timers to prevent memory leaks
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(countdownTimer);
    };
  }, [quizStatus]);

  // Handler for submitting a player's answer
  const handleAnswerSubmit = async (questionId, userAnswer) => {
    if (!quizId || !currentPlayerProfile || !currentPlayerProfile.userId) {
      return;
    }

    try {
      // Reference to the 'answers' sub-collection
      const answersCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/quizzes`,
        quizId,
        "answers"
      );
      const userId = currentPlayerProfile.userId;

      // Add the player's answer to Firestore
      await addDoc(answersCollectionRef, {
        userId: userId,
        questionId: questionId,
        userAnswer: userAnswer,
        submittedAt: new Date(),
      });

      // Move to the next question or signal completion
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setStartPhase("finished_player_side");

        // Increment the finished players count in Firestore
        const quizRef = doc(
          db,
          `artifacts/${appId}/public/data/quizzes`,
          quizId
        );
        await updateDoc(quizRef, {
          playersFinishedCount: increment(1),
        });
      }
    } catch (error) {
      setError("Failed to submit answer. Please try again.");
    }
  };

  // Display error screen if an error occurred
  if (error) {
    return <DefaultError errorMessage={error} />;
  }

  // Display a loading screen while data is being fetched
  if (isLoadingData || !roomId || !quizId || !currentPlayerProfile) {
    return <LoadingQuiz />;
  }

  // Get the current question and total question count for display
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Maximum possible score is the total number of questions
  const maxPossibleScore = questions.length;

  return (
    <main className="bg-gradient-to-b from-violet-50 to-white min-h-screen h-auto">
      {/* navbar component */}
      <Navbar roomId={roomId} quizName={quizName} />

      {/* waiting screen component */}
      {quizStatus === "waiting" && (
        <WaitingScreen
          quizName={quizName}
          roomId={roomId}
          currentPlayerProfile={currentPlayerProfile}
          currentPlayers={currentPlayers}
        />
      )}

      {/* question box component */}
      {quizStatus === "started" && (
        <>
          {startPhase === "warning" && <QuizWarning />}
          {startPhase === "countdown" && <CountDown />}
          {startPhase === "questions" && currentQuestion && (
            <QuestionBox
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              onAnswerSubmit={handleAnswerSubmit}
              currentPlayerProfile={currentPlayerProfile}
            />
          )}

          {/* waiting screen for result when quiz is ended */}
          {startPhase === "finished_player_side" && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
              <h2 className="text-3xl font-bold text-green-500 mb-4">
                You've finished the quiz!
              </h2>
              <p className="text-xl text-zinc-700">
                Waiting for the host to show results.
              </p>
              {currentPlayerProfile && (
                <div className="mt-4">
                  <Image
                    src={currentPlayerProfile.avatar}
                    alt={currentPlayerProfile.name}
                    width={96}
                    height={96}
                    className="rounded-full mx-auto my-2 shadow"
                  />
                  <p className="font-bold text-lg capitalize text-violet-500">
                    {currentPlayerProfile.name}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* quiz starting phase */}
          {startPhase === "none" && (
            <div className="game-started-screen p-4 text-center">
              <h2 className="text-2xl text-green-600 mb-4">
                Quiz is starting...
              </h2>
            </div>
          )}
        </>
      )}

      {/* quiz scoreboard component */}
      {quizStatus === "ended" && (
        <>
          <QuizScoreboard
            currentPlayers={currentPlayers}
            maxPossibleScore={maxPossibleScore}
          />

          {/* end game button */}
          <div className="w-full flex justify-center items-center">
            <Link
              href={"/"}
              className="px-3 text-sm md:px-4 py-2 mb-6 mt-6 text-red-500 bg-red-100 hover:scale-95 rounded-lg transition-all duration-200"
            >
              End Quiz
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

// Main Page component with Suspense boundary
const Page = () => {
  return (
    <>
      <Suspense fallback={<LoadingQuiz />}>
        <GameRoomManager />
      </Suspense>
    </>
  );
};

export default Page;
