const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  getDashboardAnalytics
} = require('../controllers/noteController');
const { processAiAction } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const validate = require('../validators/validate');
const { createNoteValidator, updateNoteValidator, aiActionValidator } = require('../validators/noteValidator');

const router = express.Router();

// AI-specific rate limiter: 10 requests per minute per user IP
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many AI requests. Please wait a moment before trying again.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNoteValidator, validate, createNote);

router.get('/analytics/dashboard', getDashboardAnalytics);

router.route('/:id')
  .get(getNote)
  .patch(updateNoteValidator, validate, updateNote)
  .delete(deleteNote);

router.post('/:id/share', shareNote);
router.post('/:id/ai', aiRateLimit, aiActionValidator, validate, processAiAction);

module.exports = router;
