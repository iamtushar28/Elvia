'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'; // For redirection

import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; // For Firestore queries

// If you still need appId for collection paths, ensure it's provided globally by Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const JoinRoom = () => {

    const [roomPin, setRoomPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleJoinQuiz = async () => {
        setError('');
        setIsLoading(true);

        if (roomPin.trim() === '') {
            setError('Please enter a Game PIN.');
            setIsLoading(false);
            return;
        }

        try {
            // Ensure db is initialized before use (it should be via firebase.js)
            if (!db) {
                console.error("Firestore DB is not initialized. Check firebase/firebase.js.");
                setError("Firebase services are not available.");
                setIsLoading(false);
                return;
            }

            // Create a query to find a quiz with the entered roomPin
            // Use the imported 'db' instance
            const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
            const q = query(quizzesRef, where("roomId", "==", roomPin.trim().toUpperCase()));

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Quiz found! Redirect to the host page (or a player view page)
                const quizDoc = querySnapshot.docs[0]; // Get the first matching document
                console.log("Found quiz:", quizDoc.id, quizDoc.data());
                router.push(`/join?roomId=${roomPin.trim().toUpperCase()}`);
            } else {
                // No quiz found with that PIN
                setError('Invalid Game PIN. Please try again.');
            }
        } catch (err) {
            console.error("Error joining quiz:", err);
            setError('Failed to join quiz. Please check your connection or try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full flex flex-col items-center'>

            <div className='w-full flex gap-3'>
                {/* room code input */}
                <input
                    placeholder='Enter game PIN'
                    type="text"
                    value={roomPin}
                    onChange={(e) => setRoomPin(e.target.value)}
                    disabled={isLoading}
                    className='w-full p-2 text-center border border-zinc-200 rounded-lg hover:ring-2 hover:ring-violet-300 placeholder:text-[#6B7280] placeholder:text-sm placeholder:text-center outline-none transition-all duration-300'
                />

                {/* join quiz room button */}
                <button
                    onClick={handleJoinQuiz}
                    className='px-4 py-2 text-white bg-[#8570C0] hover:bg-[#886fcbda] rounded-lg cursor-pointer transition-all duration-300'>
                    {isLoading ? 'Joining...' : 'Join'}
                </button>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

        </div>
    )
}

export default JoinRoom