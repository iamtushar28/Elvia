"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Import Firebase instances and Firestore functions
import { db } from "../firebase/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore"; // Added getDoc for initial fetch

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DefaultError from "../components/DefaultError";
import LoadingQuiz from "../components/LoadingQuiz";

// Assuming appId is globally available or passed down
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// This is a separate component that uses the search params for the Suspense boundary to work correctly.
const RoomComponent = () => {
  const searchParams = useSearchParams();
  const [quizId, setQuizId] = useState(null); // Now primarily using quizId (Firestore Doc ID)
  const [roomIdFromDb, setRoomIdFromDb] = useState(null); // To store roomId retrieved from DB
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [quizName, setQuizName] = useState("Loading Quiz...");
  const [error, setError] = useState(null);
  const [isLoadingQuizData, setIsLoadingQuizData] = useState(true); // New loading state for fetching quiz data

  useEffect(() => {
    const qId = searchParams.get("_quizId"); // Get _quizId from URL

    if (qId) {
      setQuizId(qId);
      setError(null); // Clear previous errors
      setIsLoadingQuizData(true); // Start loading

      const quizDocRef = doc(db, `artifacts/${appId}/public/data/quizzes`, qId);

      // Set up real-time listener for the quiz document
      const unsubscribe = onSnapshot(
        quizDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const quizData = docSnap.data();
            setRoomIdFromDb(quizData.roomId); // Get roomId from the document data
            setJoinedUsers(quizData.joinedUsers || []);
            setQuizName(quizData.quizName || "Untitled Quiz");
            setIsLoadingQuizData(false); // Data loaded
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

      // Cleanup function to unsubscribe from the listener when component unmounts
      return () => unsubscribe();
    } else {
      // If _quizId is not in the URL
      setError("No quiz ID provided. Please create or join a new quiz..");
      setIsLoadingQuizData(false);
    }
  }, [searchParams]); // Depend only on searchParams as it contains the _quizId

  // Conditional rendering for error or loading states
  if (error) {
    return <DefaultError errorMessage={error} />;
  }

  // Show loading fallback if quizId is not yet available or data is being fetched
  if (!quizId || isLoadingQuizData) {
    return <LoadingQuiz />;
  }

  // Once data is loaded, roomIdFromDb will be available
  return (
    <>
      <Navbar roomId={roomIdFromDb} quizName={quizName} />{" "}
      {/* Pass roomIdFromDb */}
      <Hero
        roomId={roomIdFromDb}
        quizId={quizId}
        joinedUsers={joinedUsers}
        quizName={quizName}
      />{" "}
      {/* Pass roomIdFromDb and quizId */}
    </>
  );
};

// This is your main page component
const Page = () => {
  return (
    <>
      {/* Wrap the component that uses useSearchParams in a Suspense boundary */}
      <Suspense fallback={<LoadingQuiz />}>
        <RoomComponent />
      </Suspense>
    </>
  );
};

export default Page;
