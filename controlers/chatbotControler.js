import { User } from "../models/usermodel.js";
// Correct import (must match exact filename with .js extension)
import { generateResponse ,debug} from '../services/geminiAiService.js';

export const chatWithAI = async (req, res) => {
  try {
    const { prompt, language, userId } = req.body;

    // Determine context based on prompt or explicit flag
    const context = language ? "programming" : "general"; // or another logic
    
    // Get AI response with proper context
    const aiResponse = await generateResponse(prompt, context);

    // Optional: Save to user's chat history
    await User.findByIdAndUpdate(userId, {
      $push: { chatHistory: { prompt, response: aiResponse, language } }
    });

    res.json({ reply: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "Chat failed" });
  }
};
export const Debug=async(req,res)=>{
  try{
    const { prompt,  userId } = req.body;
    if(!prompt ){
      return res.json({message:"prompt is required"});
    }
    const airesponse=await debug(prompt);
    await User.findByIdAndUpdate(userId, {
      $push: { chatHistory: { prompt, response: airesponse } }
    });
    res.json({ reply: airesponse });

  }
  catch(error){
    console.log(error);
    return result.status(500).json({error:"server error"});
  }
}