'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AvatarSelector from './AvatarSelector';
import { db, auth } from '../../firebase/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { RiLoader2Fill } from "react-icons/ri";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const CreateProfile = ({ roomId }) => {
    const [username, setUsername] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [currentUserId, setCurrentUserId] = useState(null); // Persistent userId

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

    const handleJoinQuiz = async () => {
        setError('');
        setIsLoading(true);

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
        if (!currentUserId) {
            setError('Player ID could not be initialized. Please try refreshing.');
            setIsLoading(false);
            return;
        }

        try {
            const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
            const q = query(quizzesRef, where("roomId", "==", roomId.trim().toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Quiz not found with this Room ID.');
                setIsLoading(false);
                return;
            }

            const quizDoc = querySnapshot.docs[0];
            const quizDocId = quizDoc.id;

            const playerProfile = {
                userId: currentUserId,
                name: username.trim(),
                avatar: `/avatars/avatar-${selectedAvatarId}.webp`,
                joinedAt: new Date(),
            };

            const quizRef = doc(db, `artifacts/${appId}/public/data/quizzes`, quizDocId);
            await updateDoc(quizRef, {
                [`joinedUsers.${currentUserId}`]: playerProfile
            });

            // NEW: Save the playerProfile to localStorage for access on the /game page
            localStorage.setItem('currentPlayerProfile', JSON.stringify(playerProfile));

            console.log("User joined quiz and profile saved:", playerProfile);
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
                    className='h-14 w-full capitalize bg-white text-center md:w-80 placeholder:text-zinc-400 px-4 border-2 rounded-lg border-violet-300 hover:border-[#917EC9] outline-none transition-all duration-200'
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
                    <>Joining  <RiLoader2Fill className='text-lg animate-spin' /></>
                    :
                    <>Join</>
                }
            </button>
        </>
    );
};

export default CreateProfile;
