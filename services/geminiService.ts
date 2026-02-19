
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI with the environment key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Clean JSON string from potential Markdown code blocks
 */
function cleanJsonString(str: string): string {
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
}

export async function optimizeContentForSEO(type: 'product' | 'article', content: string, lang: 'ar' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest', // Using a lighter model to ensure better access/compatibility
      contents: `You are an SEO expert for a charcoal company called "Fahm Al-Assema" (Capital Charcoal). 
      Optimize the following ${type} content for search engines in ${lang === 'ar' ? 'Arabic' : 'English'}.
      Make it professional, engaging, and include relevant keywords.
      Content: ${content}`,
    });
    return response.text || "";
  } catch (error: any) {
    console.error("Gemini SEO Error:", error);
    // Return original content if AI fails due to permission or other errors
    return content;
  }
}

export async function generateArticleDraft(title: string, lang: 'ar' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional blog post for a charcoal company's website about: "${title}". 
      The language should be ${lang === 'ar' ? 'Arabic' : 'English'}. 
      Include an introduction, 3 main points, and a call to action.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Draft Error:", error);
    return null;
  }
}

export async function getCharcoalExpertAdvice(query: string, lang: 'ar' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a technical expert at "Capital Charcoal Factory" in Egypt. 
      Answer the user query concisely (max 80 words).
      Language: ${lang === 'ar' ? 'Arabic' : 'English'}.
      Query: ${query}`,
    });
    return response.text || (lang === 'ar' ? "عذراً، لا يمكنني الرد حالياً." : "Sorry, I can't reply right now.");
  } catch (error) {
    console.error("Gemini Expert Error:", error);
    return lang === 'ar' ? "عذراً، الخبير مشغول حالياً." : "Sorry, the expert is busy right now.";
  }
}

export async function generateProductSuggestions(category: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 marketing slogans for ${category} charcoal. Return as JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    if (!response.text) return [];
    const cleaned = cleanJsonString(response.text);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Suggestions Error:", error);
    return [];
  }
}
