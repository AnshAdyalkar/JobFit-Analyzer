try {
    console.log("Loading dotenv...");
    require('dotenv').config();
    console.log("✅ dotenv loaded");

    console.log("Loading @google/generative-ai...");
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    console.log("✅ @google/generative-ai loaded");

    console.log("Loading config/gemini...");
    const { getGeminiModel } = require('./config/gemini');
    console.log("✅ config/gemini loaded");

} catch (error) {
    console.error("❌ IMPORT ERROR:", error);
}
