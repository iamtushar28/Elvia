'use client';

import React from "react";
import { useForm, FormProvider, useWatch } from 'react-hook-form';

import Navbar from "./components/Navbar";
import QuizInfo from "./components/QuizInfo";
import QuizCreation from "./components/QuizCreation";

const Page = () => {
  const methods = useForm({
    defaultValues: {
      questions: []
    }
  });

  // Watch the 'questions' array to determine overall form completeness and other stats
  const questions = useWatch({
    control: methods.control,
    name: 'questions',
    defaultValue: []
  });

  // Calculate all quiz information in one place
  const quizSummary = React.useMemo(() => {
    const total = questions.length;
    let totalSeconds = 0;
    let completeCount = 0;

    questions.forEach(q => {
      totalSeconds += (q.timeLimit || 0); // Sum up time limits

      // Determine if an individual question is complete
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
    const isFormComplete = total > 0 && incompleteCount === 0; // Form is complete if there are questions and all are complete

    return {
      total,
      complete: completeCount,
      incomplete: incompleteCount,
      totalSeconds,
      isFormComplete
    };
  }, [questions]); // Recalculate whenever 'questions' array changes

  // Destructure for easier access
  const { total, complete, incomplete, totalSeconds, isFormComplete } = quizSummary;

  // Define the onSubmit logic here, where handleSubmit is available
  const onSubmit = (data) => {
    console.log("All Quiz Data for Submission:", data.questions);
    alert('Quiz submitted! Check console for data.'); // Using alert for demonstration
  };

  return (
    <>
      {/* Pass handleSubmit as a prop to Navbar, and also the isFormComplete status */}
      <Navbar onStartQuiz={methods.handleSubmit(onSubmit)} isStartQuizEnabled={isFormComplete} />
      <FormProvider {...methods}>
        {/* Pass all calculated quiz summary props to QuizInfo */}
        <QuizInfo
          totalQuestions={total}
          completeQuestions={complete}
          incompleteQuestions={incomplete}
          totalEstimateTime={totalSeconds}
        />
        <QuizCreation />
      </FormProvider>
    </>
  );
};

export default Page;
