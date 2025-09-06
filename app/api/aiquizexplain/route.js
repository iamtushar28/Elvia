import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

export async function POST(req) {
  try {
    // Destructure all possible props
    const { question, options, correctAnswer } = await req.json();

    if (!question || !correctAnswer) {
      return NextResponse.json(
        { error: "Missing 'question' or 'correctAnswer' in request body" },
        { status: 400 }
      );
    }

    let prompt;
    if (options) {
      // Prompt for MCQ questions with options
      prompt = `Provide a short 1-2 sentence explanation for the correct answer to the following quiz question.
        Question: "${question}"
        Options: ${options.map((o) => `"${o}"`).join(", ")}
        Format the response so the correct answer & key terms are in bold using asterisks (e.g., **Correct Answer**).`;
    } else {
      // Prompt for True/False or Fill-in-the-Blank questions
      prompt = `Provide a short 1-2 sentence explanation for the correct answer to the following question.
        Question: "${question}"
        Correct Answer: "${correctAnswer}"
        Format the response so the correct answer & key terms are in bold using asterisks (e.g., **Correct Answer**).`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ explanation: text }, { status: 200 });
  } catch (error) {
    console.error("AI Explanation API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
