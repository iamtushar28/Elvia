import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Generative AI client using the API key from environment variables.
// The model 'gemini-2.5-flash-preview-05-20' is chosen for its ability to generate
// structured JSON responses via responseSchema.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

/**
 * Handles POST requests to generate quiz questions based on a user-provided prompt.
 *
 * This API endpoint takes a single 'userPrompt' string. The AI will interpret
 * the desired quiz type (MCQ, True/False, Fill-in-the-Blank), topic, and
 * number of questions from this prompt, then generate the questions
 * in a specified JSON format.
 *
 * @param {Request} req The incoming Next.js API request object.
 * @returns {Response} A JSON response containing the generated quiz questions or an error.
 */
export async function POST(req) {
  try {
    // Parse the request body to extract the user's prompt.
    // Expected body: { userPrompt: string }
    const { userPrompt } = await req.json();

    // Validate the incoming prompt.
    if (!userPrompt) {
      return new Response(JSON.stringify({ error: "Missing userPrompt" }), {
        status: 400, // Bad Request
      });
    }

    // Define the JSON schema for the AI's response. This schema guides the model
    // to output an array of quiz question objects, each with specific properties.
    // Note: 'timeLimit' is added client-side as per the user's 'append' function example.
    const generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            type: { "type": "STRING", "enum": ["mcq", "truefalse", "fillblank"], "description": "Type of question (mcq, truefalse, fillblank)." },
            questionText: { "type": "STRING", "description": "The main text of the question." },
            options: {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": { "optionText": { "type": "STRING" } },
                "required": ["optionText"]
              },
              "description": "Array of 4 options for MCQ questions, empty for others."
            },
            correctOptionIndex: { "type": "NUMBER", "description": "0-indexed position of the correct option for MCQ, null for others." },
            correctAnswer: { "type": "STRING", "description": "Correct answer for True/False and Fill-in-the-Blank, empty for MCQ." }
          },
          "required": ["type", "questionText"]
        },
        maxItems: 5 // Explicitly limit the number of items to 5 in the response schema
      }
    };

    // Construct a general prompt for the AI to interpret the user's request
    // and generate questions in the specified JSON format.
    // The prompt is shortened and explicitly states the 5-question limit.
    const prompt = `From "${userPrompt}", generate only up to 5 quiz questions. Use 'mcq', 'truefalse', or 'fillblank' types. MCQ must have 4 options and correctOptionIndex (0-3). True/False needs 'True' or 'False' as correctAnswer. Fill-in-the-blank needs '___' for blank and a correctAnswer. Output JSON array adhering to schema.`;

    // Prepare the payload for the Generative AI API call.
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfig
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GOOGLE_GENAI_API_KEY}`;
    
    // Implement exponential backoff for robust API communication.
    let apiResponse;
    let retries = 0;
    const maxRetries = 5;
    let delay = 1000; // Initial delay of 1 second

    while (retries < maxRetries) {
      try {
        apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (apiResponse.ok) {
          break; // API call successful, exit retry loop.
        } else if (apiResponse.status === 429) { // Too Many Requests error
          retries++;
          delay *= 2; // Double the delay for the next retry.
          await new Promise(res => setTimeout(res, delay)); // Wait before retrying.
        } else {
          // For other non-retryable errors, log and return an error response.
          const errorText = await apiResponse.text();
          console.error(`AI Quiz Assist API Error: ${apiResponse.status} - ${errorText}`);
          return new Response(JSON.stringify({ error: `AI quiz generation failed: ${errorText}` }), { status: apiResponse.status });
        }
      } catch (err) {
        retries++;
        delay *= 2;
        await new Promise(res => setTimeout(res, delay));
        console.warn(`Fetch attempt ${retries} failed, retrying...`, err.message);
        if (retries === maxRetries) {
          throw err; // Re-throw the error if max retries are reached.
        }
      }
    }

    // If no successful response after retries, throw an error.
    if (!apiResponse || !apiResponse.ok) {
        throw new Error("Failed to get a successful response from AI after multiple retries.");
    }

    const result = await apiResponse.json();

    // Validate the structure of the AI's response before parsing.
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const jsonText = result.candidates[0].content.parts[0].text;
      const parsedQuizData = JSON.parse(jsonText);

      // Post-process the generated quiz data to ensure it adheres strictly to the
      // desired client-side 'append' format, including default time limits
      // and ensuring correct array sizes/null values for conditional fields.
      const quizQuestions = parsedQuizData.map(q => {
        let timeLimit;
        let options = [];
        let correctOptionIndex = null;
        let correctAnswer = '';

        if (q.type === 'mcq') {
          timeLimit = 30; // Default time limit for MCQ
          // Ensure exactly 4 options, populating with empty strings if necessary.
          options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
          while (options.length < 4) {
            options.push({ optionText: '' });
          }
          // Ensure correctOptionIndex is a valid 0-3 index or null.
          if (q.correctOptionIndex !== undefined && q.correctOptionIndex !== null && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4) {
            correctOptionIndex = q.correctOptionIndex;
          }
          correctAnswer = ''; // MCQ uses correctOptionIndex
        } else if (q.type === 'truefalse') {
          timeLimit = 20; // Default time limit for True/False
          correctAnswer = q.correctAnswer || '';
          if (!['True', 'False'].includes(correctAnswer)) { // Basic validation
            correctAnswer = ''; // Reset if AI provides an invalid true/false answer
          }
        } else if (q.type === 'fillblank') {
          timeLimit = 45; // Default time limit for Fill-in-the-Blank
          correctAnswer = q.correctAnswer || '';
        } else {
          // Fallback for unexpected quizType or if AI doesn't provide a type
          timeLimit = 30;
          q.type = 'mcq'; // Default to MCQ if type is missing or invalid from AI
          // Ensure 4 options for default MCQ if type was originally missing
          options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
          while (options.length < 4) {
            options.push({ optionText: '' });
          }
          correctOptionIndex = null; // Set to null as we can't assume a correct index
          correctAnswer = '';
        }

        return {
          type: q.type,
          timeLimit,
          questionText: q.questionText || '',
          options,
          correctOptionIndex,
          correctAnswer,
        };
      });

      return new Response(JSON.stringify(quizQuestions), { status: 200 });

    } else {
      // Handle cases where the AI response structure is unexpected or missing content.
      console.error("AI Quiz Assist Error: Unexpected response structure from AI model.", result);
      return new Response(JSON.stringify({ error: "AI quiz generation failed: Unexpected or empty response from AI." }), { status: 500 });
    }

  } catch (err) {
    // Catch and handle any errors during the process.
    console.error("AI Quiz Assist General Error:", err);
    return new Response(
      JSON.stringify({
        error: err.message?.includes("timeout")
          ? "AI quiz generation timed out. Please try again."
          : `AI quiz generation failed due to an internal error: ${err.message}`,
      }),
      { status: 500 }
    );
  }
}
