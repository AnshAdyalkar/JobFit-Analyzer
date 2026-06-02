const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  console.log('✅ Gemini API Key loaded');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('⚠️ Gemini API key missing, using fallback logic');
}

const getGeminiModel = () => {
  if (!genAI) {
    throw new Error('Gemini API key missing');
  }
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });
};

module.exports = { getGeminiModel };
