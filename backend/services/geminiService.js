import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generate content using Gemini API with a single specific model and JSON parsing
 * @param {string} prompt 
 * @param {number} timeoutMs 
 * @returns {Promise<Object>}
 */
export const generateJSON = async (prompt, timeoutMs = 30000) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const MODEL_NAME = "gemini-3.1-flash-lite-preview";

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    console.log(`[Gemini] Attempting execution with single model: ${MODEL_NAME}...`);

    const generatePromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    );

    const result = await Promise.race([generatePromise, timeoutPromise]);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(`[Gemini] Parse error:`, text);
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.error(`[Gemini] Execution failed: ${error.message}`);
    throw error;
  }
};

/**
 * Standard chat completion for conversation
 */
export const getChatCompletion = async (messages) => {
  // Logic here if needed
};
