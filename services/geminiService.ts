import { GoogleGenAI } from "@google/genai";

// Per instructions, API key is in process.env.API_KEY and is assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (name: string): Promise<string> => {
    const prompt = `Создай короткую, забавную и остроумную биографию для профиля знакомств для человека по имени ${name}. Биография должна быть не длиннее 200 символов, звучать привлекательно и быть на русском языке.`;

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
        console.error("Ошибка при генерации биографии с помощью Gemini:", error);
        return "Не удалось сгенерировать биографию в данный момент. Попробуйте еще раз.";
    }
};
