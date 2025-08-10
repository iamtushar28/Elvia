'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import AvatarSelector from './AvatarSelector'; // Ensure this path is correct
import { db, auth } from '../../firebase/firebase'; // Import db and auth
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Firestore functions
import { RiLoader2Fill } from "react-icons/ri"; //loading icon

// Assuming appId is globally available or passed down
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const CreateProfile = ({ roomId }) => { // Accept roomId as a prop
    const [username, setUsername] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState(null); // State for selected avatar ID
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Effect to set a random avatar on initial load
    useEffect(() => {
        // This logic is now in CreateProfile to manage selectedAvatarId
        const TOTAL_AVATARS = 19;
        const getRandomAvatarId = () => Math.floor(Math.random() * TOTAL_AVATARS) + 1;
        setSelectedAvatarId(getRandomAvatarId());
    }, []); // Runs once on mount

    const handleJoinQuiz = async () => {
        setError('');
        setIsLoading(true);

        // Validate inputs
        if (!username.trim()) {
            setError('Please enter your name.');
            setIsLoading(false);
            return;
        }
        if (!selectedAvatarId) {
            setError('Please select an avatar.');
            setIsLoading(false);
            return;
        }
        if (!roomId) {
            setError('Room ID is missing. Please go back and try again.');
            setIsLoading(false);
            return;
        }

        try {
            // Query Firestore to find the quiz using roomId
            const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
            const q = query(quizzesRef, where("roomId", "==", roomId.trim().toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Quiz not found with this Room ID.');
                setIsLoading(false);
                return;
            }

            const quizDoc = querySnapshot.docs[0];
            const quizDocId = quizDoc.id; // Firestore Document ID (the _quizId for URL)


            const currentUserId = crypto.randomUUID(); // Generate a unique ID for this joining user

            // Prepare player data
            const playerProfile = {
                userId: currentUserId,
                name: username.trim(),
                avatar: `/avatars/avatar-${selectedAvatarId}.webp`, // Store the full avatar path
                joinedAt: new Date(),
            };

            // Update the joinedUsers array in the quiz document
            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizDocId);
            await updateDoc(quizRef, {
                joinedUsers: arrayUnion(playerProfile) // Add the new player to the array
            });

            // Redirect to /game page with roomId and quizId
            router.push(`/game?roomId=${roomId.trim().toUpperCase()}&_quizId=${quizDocId}`);

        } catch (err) {
            console.error("Error during join process:", err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* select avatar component  */}
            <AvatarSelector
                selectedAvatarId={selectedAvatarId}
                setSelectedAvatarId={setSelectedAvatarId}
            />

            {/* name of player */}
            <div className='w-full flex justify-center'>
                <input
                    type="text"
                    placeholder='Enter your name'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='h-14 w-full bg-white text-center md:w-80 placeholder:text-zinc-400 px-4 border-2 rounded-lg border-violet-300 hover:border-[#917EC9] outline-none transition-all duration-200'
                    disabled={isLoading}
                />
            </div>

            {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

            {/* join button */}
            <button
                onClick={handleJoinQuiz}
                className='w-full md:w-80 h-12 text-white bg-[#917EC9] hover:bg-[#9f84ee] rounded-lg cursor-pointer transition-all duration-200 flex justify-center items-center disabled:cursor-not-allowed'
                disabled={isLoading || !username.trim() || !selectedAvatarId}
            >
                {isLoading ?
                    <>Joining...  <RiLoader2Fill className='text-lg animate-spin' /></>
                    :
                    <>Join</>
                }
            </button>
        </>
    );
};

export default CreateProfile;
