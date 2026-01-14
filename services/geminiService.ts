
import { GoogleGenAI, Type } from "@google/genai";
import { DigraphQuestion } from "../types";
import { FALLBACK_QUESTIONS } from "../constants";

// Correctly initialize GoogleGenAI using a named parameter and process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchQuestions = async (level: number): Promise<DigraphQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 digraph word puzzles for children at level ${level}. Focus on digraphs like sh, ch, th, wh, ph, ck, qu, kn, wr. Each puzzle needs a word with the digraph replaced by underscores, the correct digraph, 4 unique options including the correct one, and a simple meaning.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              displayWord: { type: Type.STRING },
              correctDigraph: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              meaning: { type: Type.STRING }
            },
            required: ["word", "displayWord", "correctDigraph", "options", "meaning"]
          }
        }
      }
    });

    // Use .text property to get response string
    const data = JSON.parse(response.text || "[]");
    return data.length > 0 ? data : FALLBACK_QUESTIONS;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_QUESTIONS;
  }
};

export const getNarrativeFeedback = async (isCorrect: boolean, word: string, streak: number): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a very short (max 12 words) encouraging battle narration for a child playing a digraph learning game. The child just got a word ${isCorrect ? 'RIGHT' : 'WRONG'} for the word "${word}". Current streak is ${streak}. Make it sound epic and crystal-cave themed.`,
        });
        // Use .text property as per guidelines
        return response.text || (isCorrect ? "Crystal power surges!" : "The shadow thickens...");
    } catch (error) {
        return isCorrect ? "Excellent hit!" : "Watch out for the shadow!";
    }
}
