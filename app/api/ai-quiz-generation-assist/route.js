import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with API key from environment variables.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

// Define the model instance, specifying the model name.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Define the POST handler for the Next.js API route.
export async function POST(req) {
  try {
    // 1. INPUT VALIDATION
    // Parse the JSON body to get the user prompt.
    const { userPrompt } = await req.json();

    // Return a 400 error if the prompt is missing.
    if (!userPrompt) {
      return new Response(JSON.stringify({ error: "Missing userPrompt" }), {
        status: 400,
      });
    }

    // 2. GENERATION CONFIGURATION
    // Define the configuration to force the model to output a specific JSON structure.
    const generationConfig = {
      // Enforce JSON output.
      responseMimeType: "application/json",
      // Define the required structure (schema) for the JSON output.
      responseSchema: {
        type: "ARRAY", // Root element must be a JSON array.
        items: {
          type: "OBJECT", // Each item is a question object.
          properties: {
            // Define question types (MCQ, True/False, Fill-in-the-Blank).
            type: { type: "STRING", enum: ["mcq", "truefalse", "fillblank"] },
            questionText: { type: "STRING" },
            options: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: { optionText: { type: "STRING" } },
                required: ["optionText"],
              },
            },
            correctOptionIndex: { type: "NUMBER" }, // For 'mcq' type.
            correctAnswer: { type: "STRING" }, // For 'truefalse' or 'fillblank' types.
          },
          required: ["type", "questionText"],
        },
        maxItems: 6, // Limit the maximum number of questions generated.
      },
    };

    // Construct the prompt, explicitly instructing the model on the task and output format.
    const prompt = `From "${userPrompt}", generate only up to 6 quiz questions. Output JSON array adhering to schema.`;

    // 3. AI CALL WITH EXPONENTIAL BACKOFF
    let response;
    let retries = 0;
    const maxRetries = 5;
    let delay = 1000; // Initial delay of 1 second.

    // Loop for retrying the API call.
    while (retries < maxRetries) {
      try {
        // Main call to the Gemini API.
        response = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig,
        });

        break; // Exit loop on successful API call.
      } catch (err) {
        // Check for rate limit (429) or quota/rate-related errors.
        if (
          err.status === 429 ||
          err.message.includes("quota") ||
          err.message.includes("rate")
        ) {
          retries++;
          delay *= 2; // Double the delay (exponential backoff).
          // Wait for the calculated delay before retrying.
          await new Promise((res) => setTimeout(res, delay));
          if (retries === maxRetries) throw err; // Re-throw if max retries reached.
        } else {
          throw err; // Re-throw for all other unexpected errors.
        }
      }
    }

    // Throw an error if no response was received after all retries.
    if (!response) {
      throw new Error(
        "Failed to get a successful response from AI after multiple retries."
      );
    }

    // Extract the full response object.
    const result = await response.response;

    // 4. RESPONSE PROCESSING
    // Check if the response contains content parts (i.e., the generated JSON string).
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      // Extract the raw JSON text from the response part.
      const jsonText = result.candidates[0].content.parts[0].text;
      // Parse the JSON string into a JavaScript array of question objects.
      const parsedQuizData = JSON.parse(jsonText);

      // Map and normalize the parsed data into the final expected output structure.
      const quizQuestions = parsedQuizData.map((q) => {
        let options = [];
        let correctOptionIndex = null;
        let correctAnswer = "";

        if (q.type === "mcq") {
          // Normalize MCQ options: limit to 4 and ensure 4 options exist (fill with empty if needed).
          options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
          while (options.length < 4) options.push({ optionText: "" });

          // Validate and set the correct option index for MCQs.
          if (
            q.correctOptionIndex !== undefined &&
            q.correctOptionIndex !== null &&
            q.correctOptionIndex >= 0 &&
            q.correctOptionIndex < 4
          ) {
            correctOptionIndex = q.correctOptionIndex;
          }
        } else if (q.type === "truefalse") {
          let ca = (q.correctAnswer || "").trim().toLowerCase();
          // Normalize True/False answers to "True" or "False".
          if (ca === "true") correctAnswer = "True";
          else if (ca === "false") correctAnswer = "False";
          else correctAnswer = "";
        } else if (q.type === "fillblank") {
          // Set the correct answer for fill-in-the-blank.
          correctAnswer = q.correctAnswer || "";
        } else {
          // Fallback for unrecognized types: treat as an MCQ with empty options/index.
          q.type = "mcq";
          options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
          while (options.length < 4) options.push({ optionText: "" });
          correctOptionIndex = null;
        }

        // Return the standardized question object.
        return {
          type: q.type,
          questionText: q.questionText || "",
          options,
          correctOptionIndex,
          correctAnswer,
        };
      });

      // Return the final, standardized quiz questions array with a 200 status.
      return new Response(JSON.stringify(quizQuestions), { status: 200 });
    }

    // Handle case where AI call succeeded but returned unexpected or empty content.
    return new Response(
      JSON.stringify({
        error:
          "AI quiz generation failed: Unexpected or empty response from AI.",
      }),
      { status: 500 }
    );
  } catch (err) {
    // 5. GLOBAL ERROR HANDLING
    console.error("AI Quiz Assist General Error:", err);
    // Return a 500 error with a user-friendly message, checking for timeouts.
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
