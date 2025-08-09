import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBio = async (name: string, interests: string): Promise<string> => {
    if (!ai) {
        console.error("Сервис AI не настроен, так как отсутствует переменная окружения API_KEY.");
        return "Функция AI в данный момент недоступна. Пожалуйста, свяжитесь с поддержкой.";
    }

    const prompt = `Создай короткую, забавную и остроумную биографию для профиля знакомств для человека по имени ${name}. Его/ее интересы: ${interests}. Биография должна быть не длиннее 200 символов и звучать привлекательно. Пиши на русском языке.`;

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
