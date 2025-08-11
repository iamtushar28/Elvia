'use client';

import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import { useRouter } from 'next/navigation'; // Import useRouter

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const EndQuizButton = ({ quizId, db }) => {
    const router = useRouter(); // Initialize useRouter here

    const handleEndQuiz = async () => {
        if (!quizId || !db) {
            console.error("Cannot end quiz: quizId or db instance is missing.");
            return;
        }

        const confirmEnd = confirm("Are you sure you want to end the quiz and delete it permanently?");
        if (!confirmEnd) return;

        try {
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            await deleteDoc(quizRef); // Delete the main quiz document (and its subcollections)
            router.push('/'); // Redirect to home page
        } catch (error) {
            console.error("Error deleting quiz:", error);
            alert("Failed to end and delete quiz. Please try again.");
        }
    };

    return (
        <button
            onClick={handleEndQuiz}
            className="px-3 py-2 text-red-500 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer"
        >
            End Quiz!
        </button>
    );
};

export default EndQuizButton;
