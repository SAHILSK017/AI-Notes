const { check } = require('express-validator');

const createNoteValidator = [
  check('title', 'Title is required').optional().isString(),
  check('content', 'Content must be a string').optional().isString(),
  check('tags', 'Tags must be an array of strings').optional().isArray(),
  check('category', 'Category must be a string').optional().isString()
];

const updateNoteValidator = [
  check('title', 'Title must be a string').optional().isString(),
  check('content', 'Content must be a string').optional().isString(),
  check('tags', 'Tags must be an array').optional().isArray(),
  check('category', 'Category must be a string').optional().isString(),
  check('isFavorite', 'isFavorite must be a boolean').optional().isBoolean(),
  check('isPublic', 'isPublic must be a boolean').optional().isBoolean(),
  check('aiActionItems', 'aiActionItems must be an array').optional().isArray()
];

const aiActionValidator = [
  check('action', 'Action must be one of the supported AI features').isIn([
    'summary', 'action_items', 'title', 'continue_writing', 
    'expand', 'rewrite', 'simplify', 'grammar', 'tags', 
    'insights', 'quick_summary', 'auto_title', 'think_partner', 'auto_suggest', 'ai_chat'
  ])
];

module.exports = {
  createNoteValidator,
  updateNoteValidator,
  aiActionValidator
};
