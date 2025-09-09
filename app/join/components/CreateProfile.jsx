'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AvatarSelector from './AvatarSelector';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, doc, runTransaction } from 'firebase/firestore';
import { RiLoader2Fill } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const MAX_PLAYERS = 10;
const ERROR_TIMEOUT = 5000; // 5 seconds

const CreateProfile = ({ roomId }) => {
    const [username, setUsername] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [currentUserId, setCurrentUserId] = useState(null);

    // Use a ref to hold the timeout ID so it can be cleared
    const errorTimeoutRef = React.useRef(null);

    useEffect(() => {
        let storedUserId = localStorage.getItem('playerUserId');
        if (!storedUserId) {
            storedUserId = crypto.randomUUID();
            localStorage.setItem('playerUserId', storedUserId);
        }
        setCurrentUserId(storedUserId);

        const TOTAL_AVATARS = 19;
        const getRandomAvatarId = () => Math.floor(Math.random() * TOTAL_AVATARS) + 1;
        setSelectedAvatarId(getRandomAvatarId());
    }, []);

    const showTimedError = (message) => {
        // Clear any existing timeout to prevent conflicts
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }

        setError(message);

        // Set a new timeout to clear the error message
        errorTimeoutRef.current = setTimeout(() => {
            setError('');
        }, ERROR_TIMEOUT);
    };

    const handleJoinQuiz = async () => {
        setError('');
        setIsLoading(true);

        if (!roomId) {
            showTimedError('Room ID is missing. Please go back and try again.');
            setIsLoading(false);
            return;
        }
        if (!currentUserId) {
            showTimedError('Player ID could not be initialized. Please try refreshing.');
            setIsLoading(false);
            return;
        }

        try {
            const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
            const q = query(quizzesRef, where("roomId", "==", roomId.trim().toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                showTimedError('Quiz not found with this Room ID.');
                setIsLoading(false);
                return;
            }

            const quizDoc = querySnapshot.docs[0];
            const quizDocId = quizDoc.id;
            const quizDocRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizDocId);

            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(quizDocRef);
                const quizData = docSnap.data();
                const joinedUsers = quizData.joinedUsers || {};
                const userCount = Object.keys(joinedUsers).length;

                // Check if the user is already joined
                if (joinedUsers[currentUserId]) {
                    return; // User is already in the game
                }

                // Check if the room is full
                if (userCount >= MAX_PLAYERS) {
                    throw new Error('Room is full. Join another quiz.');
                }

                const playerProfile = {
                    userId: currentUserId,
                    name: username.trim(),
                    avatar: `/avatars/avatar-${selectedAvatarId}.webp`,
                    hasFinishedQuiz: false,
                    joinedAt: new Date(),
                };

                // Update the document with the new user profile
                joinedUsers[currentUserId] = playerProfile;
                transaction.update(quizDocRef, { joinedUsers });
            });

            // After successful transaction
            localStorage.setItem('currentPlayerProfile', JSON.stringify({
                userId: currentUserId,
                name: username.trim(),
                avatar: `/avatars/avatar-${selectedAvatarId}.webp`,
                hasFinishedQuiz: false,
                joinedAt: new Date(),
            }));
            router.push(`/game?roomId=${roomId.trim().toUpperCase()}&_quizId=${quizDocId}`);

        } catch (err) {
            console.error("Error during join process:", err);
            showTimedError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AvatarSelector
                selectedAvatarId={selectedAvatarId}
                setSelectedAvatarId={setSelectedAvatarId}
            />

            {/* name input */}
            <div className='w-full flex justify-center'>
                <input
                    type="text"
                    placeholder='Enter your name'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='h-14 w-full capitalize bg-white text-center md:w-80 placeholder:text-zinc-400 px-4 border-2 rounded-lg border-violet-300 hover:border-[#917EC9] outline-none transition-all duration-200'
                    disabled={isLoading}
                />
            </div>

            {/* error message */}
            {error &&
                <div className='w-full md:w-80 px-3 absolute top-8'>
                    <p className="w-full h-fit p-2 text-white bg-red-500 mb-2 rounded flex items-center gap-2">
                        <IoWarningOutline className='text-xl' />
                        {error}
                    </p>
                </div>
            }

            {/* join room button */}
            <button
                onClick={handleJoinQuiz}
                className='w-full md:w-80 h-12 text-white bg-[#917EC9] hover:bg-[#9e89db] rounded-lg cursor-pointer transition-all duration-200 flex gap-2 justify-center items-center disabled:cursor-not-allowed disabled:opacity-70'
                disabled={isLoading || !username.trim() || !selectedAvatarId}
            >
                {isLoading ?
                    <>Joining <RiLoader2Fill className='text-lg animate-spin' /></>
                    :
                    <>Join</>
                }
            </button>
        </>
    );
};

export default CreateProfile;