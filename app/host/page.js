"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Import Firebase instances and Firestore functions
import { db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DefaultError from "../components/DefaultError";
import LoadingQuiz from "../components/LoadingQuiz";

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

const RoomComponent = () => {
  const searchParams = useSearchParams();
  const [quizId, setQuizId] = useState(null);
  const [roomIdFromDb, setRoomIdFromDb] = useState(null);
  const [joinedUsers, setJoinedUsers] = useState({});
  const [quizName, setQuizName] = useState("Loading Quiz...");
  const [quizStatus, setQuizStatus] = useState("waiting");
  const [playersFinishedCount, setPlayersFinishedCount] = useState(0);
  const [questions, setQuestions] = useState([]); // NEW: State to store quiz questions
  const [error, setError] = useState(null);
  const [isLoadingQuizData, setIsLoadingQuizData] = useState(true);

  useEffect(() => {
    const qId = searchParams.get("_quizId");

    if (qId) {
      setQuizId(qId);
      setError(null);
      setIsLoadingQuizData(true);

      const quizDocRef = doc(db, `artifacts/${appId}/public/data/quizzes`, qId);

      const unsubscribe = onSnapshot(
        quizDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const quizData = docSnap.data();
            setRoomIdFromDb(quizData.roomId);
            setJoinedUsers(quizData.joinedUsers || {});
            setQuizName(quizData.quizName || "Untitled Quiz");
            setQuizStatus(quizData.status || "waiting");
            setPlayersFinishedCount(quizData.playersFinishedCount || 0);
            setQuestions(quizData.questions || []); // NEW: Update questions state
            setIsLoadingQuizData(false);
          } else {
            setError("Quiz not found or has been deleted.");
            setIsLoadingQuizData(false);
          }
        },
        (err) => {
          console.error("Error listening to quiz document:", err);
          setError("Failed to load quiz data in real-time.");
          setIsLoadingQuizData(false);
        }
      );

      return () => unsubscribe();
    } else {
      setError("No quiz ID provided. Please create or join a new quiz.");
      setIsLoadingQuizData(false);
    }
  }, [searchParams]);

  if (error) {
    return <DefaultError errorMessage={error} />;
  }

  if (!quizId || isLoadingQuizData) {
    return <LoadingQuiz />;
  }

  const allPlayersFinished =
    Object.keys(joinedUsers).length > 0 &&
    playersFinishedCount === Object.keys(joinedUsers).length;

  return (
    <>
      <Navbar roomId={roomIdFromDb} quizName={quizName} />
      <Hero
        roomId={roomIdFromDb}
        quizId={quizId}
        joinedUsers={Object.values(joinedUsers)}
        quizName={quizName}
        quizStatus={quizStatus}
        db={db}
        playersFinishedCount={playersFinishedCount}
        allPlayersFinished={allPlayersFinished}
        quizQuestions={questions} // Passing the full questions array
      />
    </>
  );
};

const Page = () => {
  return (
    <>
      <Suspense fallback={<LoadingQuiz />}>
        <RoomComponent />
      </Suspense>
    </>
  );
};

export default Page;
