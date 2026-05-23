const { GoogleGenerativeAI } = require('@google/generative-ai');
const parseJSON = require('../utils/aiResponseParser');
const AI_PROMPTS = require('../config/aiPrompts');

let genAI = null;

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
}

exports.generateNoteInsights = async (content, action) => {
  const model = getModel();

  const promptTemplate = AI_PROMPTS[action];
  if (!promptTemplate) {
    throw new Error(`Invalid AI action: ${action}`);
  }

  const result = await model.generateContent(promptTemplate(content));
  const responseText = result.response.text();
  const parsed = parseJSON(responseText);

  if (!parsed) {
    throw new Error('Failed to parse AI response.');
  }

  return parsed;
};

