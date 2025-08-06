import React, { useRef, useState } from 'react';
import { FiMusic, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { RiPlayLargeFill, RiPauseFill } from 'react-icons/ri';

const tracks = [
    { name: 'Tailspin Shuffle', file: '/music/TailspinShuffle.mp3' },
    { name: 'Paws & Effect', file: '/music/PawsAndEffect.mp3' },
    { name: 'Purfect Pick', file: '/music/PurrfectPick.mp3' },
];

const MusicPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true); //pause / play song
    const [isMuted, setIsMuted] = useState(false); // mute song
    const [currentTrack, setCurrentTrack] = useState(tracks[0]); //change song
    const [dropdownOpen, setDropdownOpen] = useState(false); //open/close dropdown

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
    };

    const handleTrackChange = (track) => {
        if (!audioRef.current) return;
        setCurrentTrack(track);
        setIsPlaying(true);
        setDropdownOpen(false);

        // Safely load and play new track
        audioRef.current.src = track.file;

        const playAfterLoad = () => {
            audioRef.current.play().catch(err => {
                console.warn('Play failed:', err);
            });
            audioRef.current.removeEventListener('canplaythrough', playAfterLoad);
        };

        audioRef.current.addEventListener('canplaythrough', playAfterLoad);
    };


    return (
        <div className="flex items-center gap-1 md:gap-2 relative">
            {/* Dropdown list */}
            {dropdownOpen && (
                <div className="h-fit w-44 py-3 px-2 bg-white shadow rounded-lg absolute top-[-190px] flex flex-col z-10">
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

            {/* Music list button */}
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="px-3 py-2 text-[#8570C0] hover:bg-zinc-100 rounded-lg transition-all duration-300 cursor-pointer flex gap-2 items-center"
            >
                <FiMusic />
                <span className="hidden md:block">{currentTrack.name}</span>
                <audio
                    ref={audioRef}
                    src={currentTrack.file}
                    autoPlay
                    loop
                    preload="auto"
                />
            </button>

            {/* Volume button */}
            <button
                onClick={toggleMute}
                className="h-fit px-3 py-2 text-xl text-[#8570C0] hover:bg-zinc-100 rounded-lg transition-all duration-300 cursor-pointer flex justify-center items-center"
            >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>

            {/* Play/pause button */}
            <button
                onClick={togglePlay}
                className="px-3 py-2 text-[#8570C0] hover:bg-zinc-100 border border-slate-200 rounded-lg cursor-pointer"
            >
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
