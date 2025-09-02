import React, { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore";
import ReviewMCQ from './reviewQuizComponents/ReviewMCQ'
import ReviewTrueFalse from './reviewQuizComponents/ReviewTrueFalse'
import ReviewFillBlank from './reviewQuizComponents/ReviewFillBlank'
import QuizReviewLoader from './reviewQuizComponents/QuizReviewLoader';

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

const ReviewQuiz = ({ quizId, currentPlayerProfile, questions, db, onCloseReview }) => {
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prepareReviewData = async () => {
      // Only proceed if all necessary props are available
      if (!quizId || !currentPlayerProfile || questions.length === 0 || !db) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all answers from the subcollection
        const answersCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`, quizId, 'answers');
        const answersSnapshot = await getDocs(answersCollectionRef);

        // Filter to get only the current player's answers
        const playerAnswers = answersSnapshot.docs
          .map(doc => doc.data())
          .filter(ans => ans.userId === currentPlayerProfile.userId);

        // Combine quiz questions with the player's answers
        const combinedReviewData = questions.map((question, index) => {
          const playerAnswer = playerAnswers.find(ans => (ans.questionId === (question.id || question.questionText)));
          let isCorrect = false;

          if (playerAnswer) {
            // Check for correctness based on question type
            if (question.type === 'mcq') {
              isCorrect = playerAnswer.userAnswer === question.correctOptionIndex;
            } else if (question.type === 'truefalse') {
              isCorrect = playerAnswer.userAnswer === question.correctAnswer;
            } else if (question.type === 'fillblank') {
              const submittedAnswerString = String(playerAnswer.userAnswer || '').trim().toLowerCase();
              const correctAnswerString = String(question.correctAnswer || '').trim().toLowerCase();
              isCorrect = submittedAnswerString === correctAnswerString;
            }
          }

          return {
            question: question,
            playerAnswer: playerAnswer ? playerAnswer.userAnswer : null,
            isCorrect: isCorrect,
            questionNumber: index + 1
          };
        });
        setReviewData(combinedReviewData);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to prepare review data:", err);
        setError("Failed to load your answers for review.");
        setIsLoading(false);
      }
    };

    prepareReviewData();
  }, [quizId, currentPlayerProfile, questions, db]);

  if (isLoading) {
    return <QuizReviewLoader />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!reviewData || reviewData.length === 0) {
    return <div className="text-center text-zinc-500 mt-10">No questions to review.</div>;
  }

  return (
    <div className='w-full h-auto flex flex-col gap-8 justify-center items-center p-4'>
      <h2 className="text-3xl font-bold text-violet-600 my-4">Quiz Review</h2>
      <div className="w-full h-fit flex flex-col justify-center items-center gap-6 md:gap-10">
        {reviewData.map((item, index) => {
          const { question, playerAnswer, isCorrect, questionNumber } = item;

          switch (question.type) {
            case 'mcq':
              return (
                <ReviewMCQ
                  key={index}
                  questionData={question}
                  playerAnswer={playerAnswer}
                  isCorrect={isCorrect}
                  questionNumber={questionNumber}
                />
              );
            case 'truefalse':
              return (
                <ReviewTrueFalse
                  key={index}
                  questionData={question}
                  playerAnswer={playerAnswer}
                  isCorrect={isCorrect}
                  questionNumber={questionNumber}
                />
              );
            case 'fillblank':
              return (
                <ReviewFillBlank
                  key={index}
                  questionData={question}
                  playerAnswer={playerAnswer}
                  isCorrect={isCorrect}
                  questionNumber={questionNumber}
                />
              );
            default:
              return null;
          }
        })}
      </div>

      <button
        onClick={onCloseReview}
        className="px-3 text-sm md:px-4 py-2 mb-4 text-violet-500 bg-violet-100 hover:scale-95 rounded-lg transition-all duration-200 cursor-pointer"
      >
        Close Review Quiz
      </button>

    </div>
  );
}

export default ReviewQuiz;