/**
 * AI Prompts Configuration
 * Centralized prompts for the Gemini AI service to ensure consistency and easier maintenance.
 */

const AI_PROMPTS = {
  summary: (content) => 
    `Provide a concise summary of the following text. Respond strictly in valid JSON format like this: { "summary": "your summary here" }. Text: \n\n${content}`,
    
  action_items: (content) => 
    `Extract a list of actionable items from the following text. Respond strictly in valid JSON format like this: { "actionItems": ["item 1", "item 2"] }. Text: \n\n${content}`,
    
  title: (content) => 
    `Suggest a short, catchy title for the following text (max 6 words). Respond strictly in valid JSON format like this: { "suggestedTitle": "Your Title" }. Text: \n\n${content}`,
    
  auto_title: (content) => 
    `Suggest a short, catchy title for the following text (max 6 words). Respond strictly in valid JSON format like this: { "suggestedTitle": "Your Title" }. Text: \n\n${content}`,
    
  continue_writing: (content) => 
    `Continue the following text naturally, maintaining its tone and context. Provide a few additional sentences or paragraphs. Respond strictly in valid JSON format like this: { "text": "the continued text here" }. Text: \n\n${content}`,
    
  expand: (content) => 
    `Expand the following text with more details, examples, and explanations while keeping the original intent. Respond strictly in valid JSON format like this: { "text": "the expanded text here" }. Text: \n\n${content}`,
    
  rewrite: (content) => 
    `Rewrite the following text to be more professional, clear, and well-structured. Correct any grammatical errors. Respond strictly in valid JSON format like this: { "text": "the rewritten text here" }. Text: \n\n${content}`,
    
  simplify: (content) => 
    `Simplify the following text so it is easy to understand for a beginner, removing complex jargon. Respond strictly in valid JSON format like this: { "text": "the simplified text here" }. Text: \n\n${content}`,
    
  grammar: (content) => 
    `Fix any grammar, spelling, or punctuation errors in the following text without altering the core meaning. Respond strictly in valid JSON format like this: { "text": "the fixed text here" }. Text: \n\n${content}`,
    
  tags: (content) => 
    `Generate 3 to 5 highly relevant single-word tags for the following text. Respond strictly in valid JSON format like this: { "tags": ["tag1", "tag2"] }. Text: \n\n${content}`,
    
  insights: (content) => 
    `Analyze the following text and provide insights. Respond strictly in valid JSON format like this: { "readingTime": "2 min read", "category": "Technology", "sentiment": "Positive", "complexity": "Intermediate" }. Text: \n\n${content}`,
    
  quick_summary: (content) => 
    `Provide a quick summary of the following text in three formats. Respond strictly in valid JSON format like this: { "oneLine": "...", "detailed": "...", "bullets": ["...", "..."] }. Text: \n\n${content}`,
};

module.exports = AI_PROMPTS;
