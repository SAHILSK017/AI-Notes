const express = require('express');
const Note = require('../models/Note');
const { ErrorResponse } = require('../middleware/error');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @desc    Get shared note
// @route   GET /api/shared/:shareId
// @access  Public
router.get('/:shareId', asyncHandler(async (req, res, next) => {
  const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true })
    .populate('userId', 'name'); // optionally get the author's name

  if (!note) {
    return next(new ErrorResponse('Shared note not found or is no longer public', 404));
  }

  res.status(200).json({
    success: true,
    data: note,
  });
}));

module.exports = router;
