import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import HighlightedText from './HighlightedText';
import { RiRobot3Line, RiLoader2Fill } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";

const AiExplain = ({ question, options, correctAnswer }) => {
    const [explanation, setExplanation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation(null);

        try {
            const payload = {
                question,
                // Only send options if they exist
                options: options || null,
                // Send the correct answer for all question types
                correctAnswer: correctAnswer || null,
            };

            const response = await fetch('/api/aiquizexplain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setExplanation(data.explanation);

        } catch (err) {
            console.error("Failed to fetch AI explanation:", err);
            setError("Failed to get explanation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-3'>

            {/* AI Explanation button */}
            <button
                onClick={getExplanation}
                disabled={isLoading || explanation}
                className='w-fit px-3 py-2 text-sm text-white bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer flex items-center gap-1 transition-all duration-200'
            >
                <RiRobot3Line className='text-xl' />
                AI Explanation
            </button>

            {/* Loading skelaton */}
            {isLoading && (
                <div className='w-full h-fit p-2 md:p-4 border border-violet-300 rounded-xl flex flex-col gap-2'>
                    <div className='w-full h-3 md:h-4 bg-violet-200 rounded-xl animate-pulse'></div>
                    <div className='w-full h-3 md:h-4 bg-violet-200 rounded-xl animate-pulse'></div>
                    <div className='w-[50%] h-3 md:h-4 bg-violet-200 rounded-xl animate-pulse'></div>
                </div>
            )}

            {/* explanation response */}
            {explanation && (
                <div className='w-full p-2 md:p-4 border border-violet-300 rounded-xl'>
                    <ReactMarkdown
                        components={{
                            // Use the custom component for bold elements
                            strong: ({ node, ...props }) => (
                                <HighlightedText {...props} />
                            ),
                        }}
                    >
                        {explanation}
                    </ReactMarkdown>
                </div>
            )}

            {/* error */}
            {error && (
                <div className='w-full p-2 md:p-4 text-sm md:text-base text-red-500 border border-red-300 rounded-xl'>
                    <p className='flex flex-wrap items-center gap-2'>
                        <IoWarningOutline className='text-lg md:text-xl' />
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AiExplain;