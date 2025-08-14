"use client";

import React from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

// Firebase Imports
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

import Navbar from "./components/Navbar";
import QuizInfo from "./components/QuizInfo";
import QuizCreation from "./components/QuizCreation";

// --- Firebase Configuration (Provided by Canvas Environment) ---
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

const Page = () => {
  const methods = useForm({
    defaultValues: {
      questions: [],
    },
  });

  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [quizName, setQuizName] = React.useState("Untitled Quiz"); //default quiz name

  //watching quiz states for completeness of all fields
  const questions = useWatch({
    control: methods.control,
    name: "questions",
    defaultValue: [],
  });

  //getting quiz summary
  const quizSummary = React.useMemo(() => {
    const total = questions.length;
    let totalSeconds = 0;
    let completeCount = 0;

    //calculating total time to complete quiz
    questions.forEach((q) => {
      totalSeconds += q.timeLimit || 0;

      let isQuestionComplete = false;

      //checking compelteness of each quiz question fields e.g. Question, Options, Selected answer
      if (q.type === "mcq") {
        isQuestionComplete =
          q.questionText?.trim() &&
          q.options?.every((opt) => opt.optionText?.trim()) &&
          q.correctOptionIndex !== null &&
          q.correctOptionIndex !== undefined;
      } else if (q.type === "truefalse") {
        isQuestionComplete =
          q.questionText?.trim() &&
          (q.correctAnswer === true || q.correctAnswer === false);
      } else if (q.type === "fillblank") {
        isQuestionComplete = q.questionText?.trim() && q.correctAnswer?.trim();
      }

      if (isQuestionComplete) {
        completeCount++; //increment count of complete quiz questions
      }
    });

    //calculating incomplete question count
    const incompleteCount = total - completeCount;
    const isFormComplete = total > 0 && incompleteCount === 0;

    //returning all details of quiz
    return {
      total,
      complete: completeCount,
      incomplete: incompleteCount,
      totalSeconds,
      isFormComplete,
    };
  }, [questions]);

  //initialize fields
  const { total, complete, incomplete, totalSeconds, isFormComplete } = quizSummary;

  //run when quiz is submitted
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const userId = auth.currentUser?.uid || crypto.randomUUID(); //generating creatorId

      //referance to tha quizzes collection
      const quizzesCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/quizzes`
      );
      const generatedRoomId = crypto.randomUUID().slice(0, 8).toUpperCase(); // generate roomId for internal storage

      // Use addDoc to create the document and get its reference (which includes the ID)
      const newQuizDocRef = await addDoc(quizzesCollectionRef, {
        creatorId: userId,
        createdAt: new Date(),
        quizName: quizName,
        questions: data.questions,
        roomId: generatedRoomId, // Store roomId
        joinedUsers: {}, //Initialize joined user object
        status: "waiting", // Initial status for the quiz
        playersFinishedCount: 0, // Initialize count of players who finished
      });

      const quizDocId = newQuizDocRef.id; // Get the auto-generated Firestore Document ID

      // Redirect to /host page, passing the Firestore Document ID as _quizId
      router.push(`/host?_quizId=${quizDocId}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navbr component*/}
      <Navbar
        onStartQuiz={methods.handleSubmit(onSubmit)}
        isStartQuizEnabled={isFormComplete}
        isLoading={isLoading}
      />

      <FormProvider {...methods}>
        {/* quiz info component */}
        <QuizInfo
          totalQuestions={total}
          completeQuestions={complete}
          incompleteQuestions={incomplete}
          totalEstimateTime={totalSeconds}
          quizName={quizName}
          setQuizName={setQuizName}
        />

        {/* quiz creation component */}
        <QuizCreation />
      </FormProvider>
    </>
  );
};

export default Page;
