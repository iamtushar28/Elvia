'use client';

import React from "react";
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Firebase Imports
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from "firebase/firestore"; // Ensure addDoc and collection are imported

import Navbar from "./components/Navbar";
import QuizInfo from "./components/QuizInfo";
import QuizCreation from "./components/QuizCreation";


// --- Firebase Configuration (Provided by Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const Page = () => {
  const methods = useForm({
    defaultValues: {
      questions: []
    }
  });

  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [quizName, setQuizName] = React.useState('Untitled Quiz'); // New: State for quiz name

  const questions = useWatch({
    control: methods.control,
    name: 'questions',
    defaultValue: []
  });

  const quizSummary = React.useMemo(() => {
    const total = questions.length;
    let totalSeconds = 0;
    let completeCount = 0;

    questions.forEach(q => {
      totalSeconds += (q.timeLimit || 0);

      let isQuestionComplete = false;
      if (q.type === 'mcq') {
        isQuestionComplete = q.questionText?.trim() &&
                             q.options?.every(opt => opt.optionText?.trim()) &&
                             (q.correctOptionIndex !== null && q.correctOptionIndex !== undefined);
      } else if (q.type === 'truefalse') {
        isQuestionComplete = q.questionText?.trim() &&
                             (q.correctAnswer === true || q.correctAnswer === false);
      } else if (q.type === 'fillblank') {
        isQuestionComplete = q.questionText?.trim() && q.correctAnswer?.trim();
      }

      if (isQuestionComplete) {
        completeCount++;
      }
    });

    const incompleteCount = total - completeCount;
    const isFormComplete = total > 0 && incompleteCount === 0;

    return {
      total,
      complete: completeCount,
      incomplete: incompleteCount,
      totalSeconds,
      isFormComplete
    };
  }, [questions]);

  const { total, complete, incomplete, totalSeconds, isFormComplete } = quizSummary;

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Use crypto.randomUUID() for creatorId if not using Firebase Auth
      // If Firebase Auth is needed for security rules, ensure anonymous login happens in firebase.js
      const userId = auth.currentUser?.uid || crypto.randomUUID();

      const quizzesCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
      const generatedRoomId = crypto.randomUUID().slice(0, 8).toUpperCase();

      await addDoc(quizzesCollectionRef, {
        creatorId: userId,
        createdAt: new Date(),
        quizName: quizName, // NEW: Include the quizName from state
        questions: data.questions,
        roomId: generatedRoomId,
      });

      console.log("Quiz saved successfully. Room ID:", generatedRoomId);
      router.push(`/host?roomId=${generatedRoomId}`);

    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar
        onStartQuiz={methods.handleSubmit(onSubmit)}
        isStartQuizEnabled={isFormComplete}
        isLoading={isLoading}
      />
      <FormProvider {...methods}>
        <QuizInfo
          totalQuestions={total}
          completeQuestions={complete}
          incompleteQuestions={incomplete}
          totalEstimateTime={totalSeconds}
          quizName={quizName}         // Pass quizName to QuizInfo
          setQuizName={setQuizName}   // Pass setQuizName to QuizInfo for editing
        />
        <QuizCreation />
      </FormProvider>
    </>
  );
};

export default Page;
