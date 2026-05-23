const Note = require('../models/Note');
const { ErrorResponse } = require('../middleware/error');
const asyncHandler = require('../utils/asyncHandler');
const { generateNoteInsights } = require('../services/aiService');
const aiCache = require('../utils/aiCache');

function friendlyError(error) {
  const msg = (error?.message || '').toLowerCase();
  const status = error?.status || error?.response?.status;

  if (status === 429 || msg.includes('quota') || msg.includes('rate') || msg.includes('resource exhausted')) {
    return { message: 'AI is temporarily busy due to high demand. Please wait 30 seconds and try again.', code: 429 };
  }
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return { message: 'AI request timed out. Please try again.', code: 504 };
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('econnrefused')) {
    return { message: 'Network error connecting to AI service. Please check your connection.', code: 503 };
  }
  if (msg.includes('invalid ai action') || msg.includes('failed to parse')) {
    return { message: 'AI returned an unexpected response. Please try again.', code: 502 };
  }
  return { message: 'AI processing failed. Please try again shortly.', code: 500 };
}

exports.processAiAction = asyncHandler(async (req, res, next) => {
  const { action } = req.body;

  if (!action) {
    return next(new ErrorResponse('Please provide an action type', 400));
  }

  const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  const contentToAnalyze = req.body.text || note.content;

  if (!contentToAnalyze || contentToAnalyze.trim() === '') {
    return next(new ErrorResponse('Content is empty. Please add content before using AI features.', 400));
  }

  const cacheKey = aiCache.getCacheKey(contentToAnalyze, action);
  const cached = aiCache.get(cacheKey);
  if (cached) {
    return res.status(200).json({ success: true, data: cached, note, cached: true });
  }

  try {
    const result = await generateNoteInsights(contentToAnalyze, action);

    let isModified = false;

    if (action === 'action_items' && result.actionItems) {
      const existingMap = new Map((note.aiActionItems || []).map(item => {
        const key = typeof item === 'string' ? item : item.text;
        return [key, item];
      }));
      note.aiActionItems = result.actionItems.map(text => {
        if (existingMap.has(text)) {
          const existing = existingMap.get(text);
          return typeof existing === 'string' ? { text, completed: false } : existing;
        }
        return { text, completed: false };
      });
      isModified = true;
    }

    if (!req.body.text) {
      if (action === 'summary' && result.summary) {
        note.aiSummary = result.summary;
        isModified = true;
      } else if (action === 'insights' && result.category) {
        note.category = result.category;
        isModified = true;
      } else if ((action === 'title' || action === 'auto_title') && result.suggestedTitle) {
        note.title = result.suggestedTitle;
        isModified = true;
      }
    }

    if (isModified) await note.save();

    aiCache.set(cacheKey, result);

    return res.status(200).json({ success: true, data: result, note });
  } catch (error) {
    const { message, code } = friendlyError(error);
    return res.status(code).json({ success: false, message });
  }
});
