import React, { useState } from 'react';
import HighlightedText from './HighlightedText';
import { RiRobot3Line, RiLoader2Fill } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';

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
                className='w-fit px-3 py-2 text-white bg-[#a281fe] hover:bg-[#9069fd] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer flex items-center gap-1 transition-all duration-200'
            >
                <RiRobot3Line className='text-xl' />
                AI Explanation
            </button>

            {/* Loading state */}
            {isLoading && (
                <div className="mt-4 p-3 w-full h-fit bg-violet-50 text-violet-800 rounded-lg flex items-center gap-2">
                    <RiLoader2Fill className="animate-spin text-xl" />
                    Explaining with AI...
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
                <div className='w-full px-4 py-4 text-red-600 border border-red-300 rounded-xl'>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default AiExplain;