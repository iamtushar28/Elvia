import React, { useState } from 'react';
import { RiRobot3Line } from 'react-icons/ri'; // Assuming you have react-icons installed
import { BsStars } from 'react-icons/bs';   // Assuming you have react-icons installed
import { RiLoader2Fill } from "react-icons/ri"; //loading icon
import { IoWarningOutline } from "react-icons/io5"; //warning icon

/**
 * AiQuizGeneration Component
 *
 * This component provides a UI for users to input a prompt
 * and generate quiz questions using an AI API.
 * It manages the prompt input state and handles the API call.
 *
 * @param {function} props.onQuestionsGenerated - Callback function to receive generated questions.
 */

const AiQuizGeneration = ({ onQuestionsGenerated }) => {

  // State to store the user's prompt from the textarea
  const [prompt, setPrompt] = useState('');

  // State to manage loading status during AI generation
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // State to store any errors during AI generation
  const [aiError, setAiError] = useState(null);

  // Function to handle changes in the textarea
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  // Function to handle the "Generate Questions" button click
  const handleGenerateQuestions = async () => {

    setIsLoadingAI(true); // Notify parent component that loading has started
    setAiError(null); // Clear any previous errors

    try {
      // Make a POST request to your Next.js API route
      const response = await fetch('/api/ai-quiz-generation-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt: prompt }), // Send the prompt in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData.error);
        aiError(errorData.error || 'Failed to generate questions. Please try again.');
        return;
      }

      const generatedQuestions = await response.json();

      // Pass the generated questions back to the parent component
      if (onQuestionsGenerated) {
        onQuestionsGenerated(generatedQuestions);
      }

    } catch (error) {
      console.error('Fetch Error:', error);
      aiError('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsLoadingAI(false); // Notify parent component that loading has finished
    }
  };

  return (
    <div className='w-full h-auto mt-6 px-3 md:px-6 py-6 md:py-8 bg-white rounded-lg shadow flex gap-5 flex-col'>

      {/* title */}
      <div className='flex gap-2 items-start'> {/* Added items-start for better alignment */}
        <RiRobot3Line className='text-[#8570C0] text-3xl md:text-2xl mt-1' />
        <div>
          <h2 className='text-lg text-zinc-700'>
            Generate Questions with AI
          </h2>
          <p className='text-zinc-500 text-sm'>Paste content about a topic, and our AI will generate quiz questions for you.</p>
        </div>
      </div>

      {/* Textarea for the prompt */}
      <textarea
        name="prompt"
        id="prompt"
        placeholder='E.g. Generate 5 MCQ questions on React.js basics.'
        rows={5}
        value={prompt} // Bind textarea value to state
        onChange={handlePromptChange} // Handle input changes
        className='p-4 w-full border border-zinc-300 outline-none rounded-lg placeholder:text-zinc-400 hover:ring-2 hover:ring-violet-400 transition-all duration-300'
      ></textarea>

      {/* Generate questions button */}
      <button
        onClick={handleGenerateQuestions} // Call the handler on click
        disabled={isLoadingAI || !prompt.trim()}
        className='w-fit px-4 py-2 text-white bg-[#8570C0] rounded-lg cursor-pointer transition-all duration-300 flex gap-2 items-center hover:bg-[#6c59a0] disabled:opacity-50 disabled:cursor-not-allowed' // Added hover effect
      >
        <BsStars />
        Generate Questions
      </button>

      {/* Loading and Error Indicators for AI Generation */}
      {isLoadingAI && (
        <div className="mt-4 p-3 w-full h-fit bg-violet-50 text-violet-800 rounded-lg flex items-center gap-2">
          <RiLoader2Fill className="animate-spin text-xl" />
          Generating questions with AI...
        </div>
      )}
      {aiError && (
        <div className="mt-4 p-3 w-full h-fit bg-red-50 text-red-500 rounded-lg flex flex-wrap items-center gap-2">
          <IoWarningOutline className="text-xl" />
          Error: {aiError} Lorem ipsum dolor
        </div>
      )}

    </div>
  );
};

export default AiQuizGeneration;
