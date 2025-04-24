import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Configure environment variables
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

/**
 * Generates a response from Gemini AI
 * @param {string} prompt - User's input (code question or general chat)
 * @param {string} [context="programming"] - Context type ('programming' or 'general')
 * @returns {Promise<string>} AI-generated response
 */
export async function generateResponse(prompt, language = "en") {
  try {
    let instruction;
    
    // If language is specified, assume it's a programming question
    if (language && language !== "en") {
      instruction = `[Programming Assistant in ${language}]
      Please provide:
      1. A clear explanation
      2. Code examples if applicable
      3. Best practices
      4. Common pitfalls
      
      Question: ${prompt}`;
    } else {
      instruction = `[General Conversation]
      Respond naturally and conversationally to this greeting or question.
      Keep responses friendly and under 3 sentences.
      
      User: ${prompt}`;
    }

    const result = await model.generateContent(instruction);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble responding right now. Please try again.";
  }
}
export async function debug(prompt ){
  try{
    let instruction;
    
      instruction = `[Programming Assistant]
      Please provide:
      1. The correct code based of the type of programing language provided
      2. Where is the error
      3. Best practices
      4. Common pitfalls
      
      Question: ${prompt}`;
    
    
    const result = await model.generateContent(instruction);
    return result.response.text();
  }
  catch(error){
    console.error("Gemini Error:", error);
    return "I'm having trouble responding right now. Please try again.";
  }
}