

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
    `Analyze the following note as a behavioral and productivity pattern report.

Return practical, specific insights based only on the note. Avoid generic advice.

Respond strictly in valid JSON format like this:
{
  "readingTime": "1 min read",
  "category": "Productivity",
  "sentiment": "Focused",
  "complexity": "Simple",
  "observations": ["The day is organized as a sequence of errands, school, fitness, and rest.", "The note uses numbered steps, which suggests the user thinks in linear execution."],
  "blindSpots": ["Travel time between activities is not planned.", "Energy level after school may affect the gym plan."],
  "suggestions": ["Add realistic time blocks to each task.", "Group errands before school to reduce context switching.", "Add one buffer slot for delays."]
}

Text: \n\n${content}`,

  quick_summary: (content) =>
    `Provide a quick summary of the following text in three formats. Respond strictly in valid JSON format like this: { "oneLine": "...", "detailed": "...", "bullets": ["...", "..."] }. Text: \n\n${content}`,

  think_partner: (content) =>
    `Act as an adaptive thinking partner.

Match the depth of analysis to the complexity of the user's note.

Important rules:
- Do NOT force business models, market analysis, strategic frameworks, competitors, or execution systems onto casual personal notes, routines, school plans, errands, or simple daily planning.
- For lightweight notes, provide short practical insights, obvious risks, and simple improvements.
- Avoid sounding artificially intellectual.
- Avoid turning normal daily activities into startup analysis.
- Only include businessModels or competitors when the note is clearly about a business, product, market, startup, or competitive idea.
- If a section is not relevant, return an empty array for it.

Respond strictly in valid JSON format like this:
{
  "mode": "lightweight",
  "practicalInsights": ["simple useful observation"],
  "risks": ["obvious practical risk"],
  "simpleImprovements": ["small improvement"],
  "businessModels": [],
  "executionPlan": [],
  "flaws": [],
  "competitors": []
}

For complex business/project notes, you may use:
{
  "mode": "strategic",
  "practicalInsights": ["core strategic observation"],
  "risks": ["risk 1"],
  "simpleImprovements": [],
  "businessModels": ["model 1"],
  "executionPlan": ["step 1"],
  "flaws": ["assumption or weak logic"],
  "competitors": ["competitor or category"]
}

Text to analyze: \n\n${content}`,

  auto_suggest: (content) =>
    `Analyze the current note context and generate one smart, context-aware live suggestion.

Rules:
- Keep the combined "insight" and "why" under 40 words.
- Avoid generic ideas and obvious continuations.
- Be specific and strategic.
- Explain why the suggestion fits this exact note context.
- Sound like an intelligent thinking partner, not autocomplete.
- Prioritize product ideas, blind spots, opportunities, execution direction, and technical strategy.
- If the note is about learning or project inspiration, prefer a concrete productized direction over broad app ideas.

Respond strictly in valid JSON format like this:
{
  "insight": "Turn this into a project-picker that ranks MERN ideas by portfolio value, difficulty, and deployability.",
  "why": "The note is stuck at getting started; scoring ideas converts inspiration into a concrete next decision.",
  "actions": ["Expand", "Challenge", "Architecture"]
}

Text: \n\n${content}`,

  ai_chat: (content) =>
    `You are a true domain-adaptive intellectual reasoning partner and strategic collaborator. You are NOT a generic productivity assistant or motivational chatbot.

Before responding, CLASSIFY the active note domain from the following:
- Software Engineering
- Startup / Business
- Productivity
- Research
- Debate / Philosophy
- Personal Reflection
- Brainstorming
- Academic Study
- Creative Writing
- General Knowledge

Once classified, ADAPT your reasoning mode dynamically:
- Software Engineering: Focus on architecture analysis, scalability, security flaws, performance bottlenecks.
- Startup / Business: Focus on market validation, monetization risks, MVP prioritization, competition.
- Debate / Philosophy: Focus on logical weaknesses, counterarguments, hidden assumptions, bias detection.
- Research / Academic: Focus on concept simplification, contradiction detection, knowledge gaps, synthesis.
- Personal Reflection: Focus on emotional pattern recognition, behavioral analysis, reflective questioning.

Conversation & Memory Rules:
- Reference previous messages to maintain conversational continuity.
- NEVER repeat advice or use repetitive self-help language.
- Deepen the reasoning over time as the conversation progresses.
- Avoid vague motivational advice (e.g., "stay consistent", "you got this").

Strategic Questioning & Response Structure:
- Provide direct, concise analysis.
- Identify at least one specific weakness, opportunity, or blind spot.
- Always include an optional follow-up challenge question to expand thinking or drive execution clarity.
- Prioritize reasoning quality over positivity. Tone should be analytical, concise, and domain-appropriate.
- Avoid excessive bullet spam, generic summaries, or filler text.

Respond strictly in valid JSON format like this:
{
  "reply": "Direct, analytical response containing the core reasoning and identified weakness.",
  "followUps": ["Sharp challenge question 1", "Strategic follow-up 2"]
}

Conversation and note context:
\n\n${content}`,
};

module.exports = AI_PROMPTS;
