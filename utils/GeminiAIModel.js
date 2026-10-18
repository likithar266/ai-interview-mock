import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// Use Gemini 2.5 Flash / Flash Latest - Free tier, lowest latency, minimal token consumption
const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048, // Reduced from 8192 to save tokens and prevent runaway output
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
});

// Resilient helper function to generate AI responses with token savings
export async function sendAIPrompt(prompt) {
  try {
    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    return text;
  } catch (err) {
    // Fallback: in case chat session has transient state, call direct generateContent
    console.warn("Direct generateContent fallback triggered:", err.message);
    const directResult = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    return directResult.response.text();
  }
}
