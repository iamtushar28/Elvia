'use client';

import React, { useState } from 'react';
import { deleteDoc, doc, collection, query, getDocs, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Helper function to recursively delete a collection (client-side implementation)
// This function is designed to delete all documents within the provided 'collectionRef'.
// It works for both top-level collections and subcollections.
const deleteCollection = async (dbInstance, collectionRef, batchSize = 100) => {
    const q = query(collectionRef);

    return new Promise((resolve, reject) => {
        getDocs(q)
            .then((snapshot) => {
                if (snapshot.empty) {
                    resolve();
                    return;
                }

                const batch = writeBatch(dbInstance);
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(() => snapshot);
            })
            .then((snapshot) => {
                if (snapshot.size === batchSize) {
                    return setTimeout(() => deleteCollection(dbInstance, collectionRef, batchSize).then(resolve).catch(reject), 1000);
                }
                resolve();
            })
            .catch(reject);
    });
};


const EndQuizButton = ({ quizId, db }) => {
    const router = useRouter();
    const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);

    const handleEndQuiz = async () => {
        if (!quizId || !db) {
            console.error("Cannot end quiz: quizId or db instance is missing.");
            alert("Error: Quiz ID or database connection missing.");
            return;
        }

        try {
            // Delete the 'answers' subcollection first
            const answersCollectionRef = collection(db, `artifacts/${appId}/public/data/quizzes`, quizId, 'answers');
            await deleteCollection(db, answersCollectionRef);

            // Then, delete the main quiz document
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizId);
            await deleteDoc(quizRef);
            router.push('/');

        } catch (error) {
            console.error("Error deleting quiz and subcollections:", error);
            alert("Failed to end and delete quiz. Please check console for details.");
        }
        setOpenDeleteQuizModal(false); // Close the modal after the operation is complete
    };

    return (
        <>
            {/* quiz delete confirmation modal */}
            {openDeleteQuizModal && (
                <div className='flex justify-center items-center px-3 absolute bottom-20 right-0 md:right-4'>
                    <div className='h-auto w-full md:w-[28rem] p-4 bg-white shadow rounded-lg'>
                        <p className='text-sm md:text-base text-zinc-500'>Are you sure you want to <span className='font-semibold'>end</span> the quiz and <span className='font-semibold'>delete</span> it permanently? This action cannot be undone.</p>
                        <div className='mt-2 flex gap-2 justify-end'>
                            {/* cancel deletion */}
                            <button
                                onClick={() => setOpenDeleteQuizModal(false)}
                                className='px-3 py-1 text-[#8570C0] hover:bg-zinc-100 border border-slate-200 rounded-lg cursor-pointer'
                            >
                                Cancel
                            </button>
                            {/* delete quiz */}
                            <button
                                onClick={handleEndQuiz}
                                className='px-3 py-1 text-sm md:text-base text-red-500 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* end quiz button */}
            <button
                onClick={() => setOpenDeleteQuizModal(true)}
                className="px-3 py-2 text-sm md:text-base text-red-500 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer"
            >
                End Quiz!
            </button>
        </>
    );
};

export default EndQuizButton;