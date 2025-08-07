import React, { useEffect, useRef, useState } from 'react';
import { FiMusic, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { RiPlayLargeFill, RiPauseFill } from 'react-icons/ri';

// List of available tracks with their display names and file paths
const tracks = [
    { name: 'Tailspin Shuffle', file: '/music/TailspinShuffle.mp3' },
    { name: 'Paws & Effect', file: '/music/PawsAndEffect.mp3' },
];

const MusicPlayer = () => {
    const audioRef = useRef(null); // Reference to the audio element
    const dropdownRef = useRef(null); // Reference to the dropdown element
    const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause
    const [isMuted, setIsMuted] = useState(false); // State to track mute/unmute
    const [currentTrack, setCurrentTrack] = useState(tracks[0]); // Currently selected track
    const [dropdownOpen, setDropdownOpen] = useState(false); // Controls dropdown visibility
    const [isLoading, setIsLoading] = useState(false); // Indicates if audio is loading

    // Toggles play and pause state of the audio
    const togglePlay = () => {
        if (!audioRef.current || isLoading) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Toggles mute and unmute state of the audio
    const toggleMute = () => {
        if (!audioRef.current || isLoading) return;
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
    };

    // Handles track change logic including loading state and playback
    const handleTrackChange = (track) => {
        if (!audioRef.current || isLoading) return;
        setCurrentTrack(track);
        setDropdownOpen(false);
        setIsPlaying(true);
        setIsLoading(true);

        // Change audio source to the selected track
        audioRef.current.src = track.file;

        // Wait for audio to be ready before playing
        const onCanPlay = () => {
            audioRef.current.play().catch(err => {
                console.warn('Play failed:', err);
            });
            setIsLoading(false);
            audioRef.current.removeEventListener('canplaythrough', onCanPlay);
        };

        audioRef.current.addEventListener('canplaythrough', onCanPlay);
    };

    // Closes dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center gap-1 md:gap-2 relative">

            {/* Dropdown of music list */}
            {dropdownOpen && (
                <div ref={dropdownRef} className="h-fit w-44 py-3 px-2 bg-white shadow rounded-lg absolute top-[-160px] flex flex-col z-10">
                    <h4 className="font-semibold border-b border-zinc-200 pb-1 pl-2 mb-2">Select Music</h4>
                    {tracks.map((track, index) => (
                        <button
                            key={index}
                            onClick={() => handleTrackChange(track)}
                            className="h-9 pl-2 text-start w-full rounded hover:bg-violet-50 cursor-pointer transition-all duration-200"
                        >
                            {track.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Open Music list button */}
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`px-3 py-2 text-[#8570C0] hover:bg-zinc-100 rounded-lg transition-all duration-300 flex gap-2 items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <FiMusic />
                <span className="hidden md:block">{currentTrack.name}</span>
                <audio
                    ref={audioRef}
                    src={currentTrack.file}
                    loop
                    preload="auto"
                    crossOrigin="anonymous"
                />
            </button>

            {/* Mute/Unmute button */}
            <button
                onClick={toggleMute}
                disabled={isLoading}
                className={`h-fit px-3 py-2 text-xl text-[#8570C0] hover:bg-zinc-100 rounded-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} flex justify-center items-center`}>
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>

            {/* Play/pause button */}
            <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`px-3 py-2 text-[#8570C0] hover:bg-zinc-100 border border-slate-200 rounded-lg 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

                {isPlaying ? (
                    <>
                        <RiPauseFill className="block md:hidden" />
                        <span className="hidden md:block">Pause</span>
                    </>
                ) : (
                    <>
                        <RiPlayLargeFill className="block md:hidden" />
                        <span className="hidden md:block">Play</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default MusicPlayer;
