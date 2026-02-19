
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Clean JSON string from potential Markdown code blocks
 */
function cleanJsonString(str: string): string {
  // Removes markdown backticks if present
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
}

export async function optimizeContentForSEO(type: 'product' | 'article', content: string, lang: 'ar' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an SEO expert for a charcoal company called "Fahm Al-Assema" (Capital Charcoal). 
      Optimize the following ${type} content for search engines in ${lang === 'ar' ? 'Arabic' : 'English'}.
      Make it professional, engaging, and include relevant keywords for charcoal trading and export.
      Content: ${content}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function generateArticleDraft(title: string, lang: 'ar' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional blog post for a charcoal company's website about: "${title}". 
      The language should be ${lang === 'ar' ? 'Arabic' : 'English'}. 
      Include an introduction, 3 main points about quality/benefits, and a call to action.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function getCharcoalExpertAdvice(query: string, lang: 'ar' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a technical expert at "Capital Charcoal Factory" in Egypt. 
      Answer the following user query about charcoal types, uses, or quality in a helpful and professional way.
      Keep the answer concise (max 100 words).
      Language: ${lang === 'ar' ? 'Arabic' : 'English'}.
      Query: ${query}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Expert Error:", error);
    return lang === 'ar' ? "عذراً، الخبير مشغول حالياً. حاول لاحقاً." : "Sorry, the expert is busy right now. Try later.";
  }
}

export async function generateProductSuggestions(category: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 marketing slogans for a charcoal brand specialized in ${category}. Return the result as a JSON array.`,
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
    console.error("Gemini Error:", error);
    return [];
  }
}
