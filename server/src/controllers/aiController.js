const crypto = require('crypto');
const Note = require('../models/Note');
const { ErrorResponse } = require('../middleware/error');
const asyncHandler = require('../utils/asyncHandler');
const { generateNoteInsights } = require('../services/aiService');

// --- In-memory response cache (content hash + action → result, TTL 5 min) ---
const aiCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(content, action) {
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
  return `${action}:${hash}`;
}

function getFromCache(key) {
  const entry = aiCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    aiCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  // Prevent unbounded growth — keep max 200 entries
  if (aiCache.size >= 200) {
    const firstKey = aiCache.keys().next().value;
    aiCache.delete(firstKey);
  }
  aiCache.set(key, { data, timestamp: Date.now() });
}

// --- Map Gemini/HTTP errors to clean user-facing messages ---
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

// @desc    Process AI actions on a note
// @route   POST /api/notes/:id/ai
// @access  Private
exports.processAiAction = asyncHandler(async (req, res, next) => {
  const { action } = req.body;

  if (!action) {
    return next(new ErrorResponse('Please provide an action type', 400));
  }

  const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  if (!note.content || note.content.trim() === '') {
    return next(new ErrorResponse('Note is empty. Please add content before using AI features.', 400));
  }

  // --- Check cache first ---
  const cacheKey = getCacheKey(note.content, action);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.status(200).json({ success: true, data: cached, note, cached: true });
  }

  try {
    const result = await generateNoteInsights(note.content, action);

    // Auto-save structured AI outputs to the note document
    let isModified = false;
    if (action === 'summary' && result.summary) {
      note.aiSummary = result.summary;
      isModified = true;
    } else if (action === 'action_items' && result.actionItems) {
      note.aiActionItems = result.actionItems;
      isModified = true;
    } else if ((action === 'title' || action === 'auto_title') && result.suggestedTitle) {
      note.title = result.suggestedTitle;
      isModified = true;
    }

    if (isModified) {
      await note.save();
    }

    // Cache the result
    setCache(cacheKey, result);

    return res.status(200).json({ success: true, data: result, note });
  } catch (error) {
    const { message, code } = friendlyError(error);
    return res.status(code).json({ success: false, message });
  }
});
