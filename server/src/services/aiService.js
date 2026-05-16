const { GoogleGenerativeAI } = require('@google/generative-ai');
const parseJSON = require('../utils/aiResponseParser');
const AI_PROMPTS = require('../config/aiPrompts');

exports.generateNoteInsights = async (content, action) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

  const promptTemplate = AI_PROMPTS[action];
  if (!promptTemplate) {
    throw new Error(`Invalid AI action: ${action}`);
  }

  const prompt = promptTemplate(content);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    const parsedData = parseJSON(responseText);
    
    if (!parsedData) {
      throw new Error('The AI service returned an invalid response format.');
    }

    return parsedData;
  } catch (error) {
    console.error(`AI Generation Error [${action}]:`, error);
    throw new Error('Failed to generate insights. The AI service might be busy or the content is too complex.');
  }
};
