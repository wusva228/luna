
import { GoogleGenAI } from "@google/genai";

// This will be undefined in the browser without a build step, so we handle it gracefully.
const apiKey = process.env.API_KEY;

// Conditionally initialize the AI client only if the API key exists.
// This prevents the app from crashing on load if the key is not provided in the environment.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBio = async (name: string, interests: string): Promise<string> => {
    if (!ai) {
        console.error("AI service is not configured because the API_KEY environment variable is missing.");
        return "AI feature is currently unavailable. Please contact support.";
    }

    const prompt = `Create a short, fun, and witty dating profile bio for a person named ${name}. Their interests are: ${interests}. The bio should be under 200 characters and sound engaging.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 } // For faster response
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating bio with Gemini:", error);
        return "Couldn't generate a bio at the moment. Please try again.";
    }
};
