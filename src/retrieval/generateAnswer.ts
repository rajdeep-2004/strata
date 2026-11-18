import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./buildPrompt";
import { ANSWER_MODEL } from "./retrievalConfig";
const ai = new GoogleGenAI({});

export async function generateAnswer(prompt: string) {
  const response = await ai.models.generateContent({
    model: ANSWER_MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return response.text;
}
