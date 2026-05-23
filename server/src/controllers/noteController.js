const noteService = require('../services/noteService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/error');

exports.getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getAllNotes(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, notes, 'Notes retrieved successfully'));
});

exports.getNote = asyncHandler(async (req, res, next) => {
  const note = await noteService.getNoteById(req.params.id, req.user.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(new ApiResponse(200, note, 'Note retrieved successfully'));
});

exports.createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote({ ...req.body, userId: req.user.id });
  res.status(201).json(new ApiResponse(201, note, 'Note created successfully'));
});

exports.updateNote = asyncHandler(async (req, res, next) => {
  const note = await noteService.updateNote(req.params.id, req.user.id, req.body);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(new ApiResponse(200, note, 'Note updated successfully'));
});

exports.deleteNote = asyncHandler(async (req, res, next) => {
  const result = await noteService.deleteNote(req.params.id, req.user.id);

  if (!result) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(new ApiResponse(200, {}, 'Note deleted successfully'));
});

exports.shareNote = asyncHandler(async (req, res, next) => {
  const note = await noteService.shareNote(req.params.id, req.user.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(new ApiResponse(200, note, 'Note shared successfully'));
});

exports.getDashboardAnalytics = asyncHandler(async (req, res) => {
  const analytics = await noteService.getDashboardAnalytics(req.user.id);
  res.status(200).json(new ApiResponse(200, analytics, 'Dashboard analytics retrieved successfully'));
});
