import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

export async function generateAnswer(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });
  return response.text;
}
