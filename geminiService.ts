
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DigraphQuestion, Artifact } from "./types";
import { FALLBACK_QUESTIONS } from "./constants";

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

    const data = JSON.parse(response.text || "[]");
    return data.length > 0 ? data : FALLBACK_QUESTIONS;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_QUESTIONS;
  }
};

export const getNarrativeFeedback = async (isCorrect: boolean, word: string, streak: number, voice: string = 'Kore'): Promise<{ text: string, audio?: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a very short (max 12 words) encouraging battle narration for a child playing a digraph learning game. The child just got a word ${isCorrect ? 'RIGHT' : 'WRONG'} for the word "${word}". Current streak is ${streak}. Make it sound epic and crystal-cave themed.`,
        });
        const text = response.text || (isCorrect ? "Crystal power surges!" : "The shadow thickens...");
        const audio = await generateSpeech(text, voice);
        return { text, audio };
    } catch (error) {
        const text = isCorrect ? "Excellent hit!" : "Watch out for the shadow!";
        const audio = await generateSpeech(text, voice);
        return { text, audio };
    }
};

export const generateArtifactImage = async (chapterName: string, guardianName: string): Promise<Artifact> => {
  const dynamicAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Get description
  const descResponse = await dynamicAi.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Describe a unique, beautiful magical relic found in ${chapterName} after defeating ${guardianName}. It should be crystalline and symbolic of phonics/voice. Max 20 words for the description and give it a name.`
  });
  
  const text = descResponse.text || "The Crystal of Clarity";
  const name = text.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 30);
  
  // 2. Generate Image
  const imgResponse = await dynamicAi.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A highly detailed, cinematic digital painting of a magical crystal artifact: ${text}. Intricate lighting, bokeh background, holographic aura, 4k resolution.` }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  let imageUrl = "";
  for (const part of imgResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    id: `art-${Date.now()}`,
    name: name,
    description: text,
    imageUrl: imageUrl,
    timestamp: Date.now()
  };
};

export const generateRestorationVideo = async (chapterName: string): Promise<string> => {
  const dynamicAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await dynamicAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A cinematic shot of ${chapterName} where shadows are dissolving into bright white crystalline light, revealing a lush and vibrant fantasy island. Restoration of sound and color.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await dynamicAi.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateSpeech = async (text: string, voice: string = 'Kore'): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return undefined;
  }
};
