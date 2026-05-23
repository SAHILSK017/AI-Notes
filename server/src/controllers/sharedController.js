const Note = require('../models/Note');
const { ErrorResponse } = require('../middleware/error');
const asyncHandler = require('../utils/asyncHandler');

exports.getSharedNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true })
    .populate('userId', 'name');

  if (!note) {
    return next(new ErrorResponse('Shared note not found or is no longer public', 404));
  }

  res.status(200).json({ success: true, data: note });
});
