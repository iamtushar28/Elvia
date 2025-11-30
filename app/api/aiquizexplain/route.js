import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

// Define the model instance.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Define the POST handler for the Next.js API route.
export async function POST(req) {
  try {
    // 1. INPUT VALIDATION
    // Destructure necessary data (question, options, and the correct answer) from the request body.
    const { question, options, correctAnswer } = await req.json();

    // Ensure the fundamental pieces (question and answer) are present.
    if (!question || !correctAnswer) {
      return NextResponse.json(
        { error: "Missing 'question' or 'correctAnswer' in request body" },
        { status: 400 } // Bad Request
      );
    }

    // 2. PROMPT CONSTRUCTION
    let prompt;

    // Check if options are provided (implies MCQ).
    if (options) {
      // Prompt template for Multiple-Choice Questions (MCQ).
      prompt = `Provide a short 1-2 sentence explanation for the correct answer to the following quiz question.
        Question: "${question}"
        Options: ${options.map((o) => `"${o}"`).join(", ")}
        Format the response so the correct answer & key terms are in bold using asterisks (e.g., **Correct Answer**).`;
    } else {
      // Prompt template for True/False or Fill-in-the-Blank questions.
      prompt = `Provide a short 1-2 sentence explanation for the correct answer to the following question.
        Question: "${question}"
        Correct Answer: "${correctAnswer}"
        Format the response so the correct answer & key terms are in bold using asterisks (e.g., **Correct Answer**).`;
    }

    // 3. AI CALL
    // Send the prompt to the model for content generation.
    const result = await model.generateContent(prompt);

    // Extract the raw response object.
    const response = await result.response;

    // Extract the plain text content from the response.
    const text = response.text();

    // 4. SUCCESS RESPONSE
    // Return the generated explanation text as a JSON response.
    return NextResponse.json({ explanation: text }, { status: 200 });
  } catch (error) {
    // 5. ERROR HANDLING
    console.error("AI Explanation API Error:", error);
    // Return a generic 500 status on failure.
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
