require('dotenv').config();
const { getGeminiModel } = require('./config/gemini');

const model = getGeminiModel();
console.log("Model requested:", model.model);
console.log("Model params:", JSON.stringify(model));
