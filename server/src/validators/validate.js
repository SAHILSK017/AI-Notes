const { validationResult } = require('express-validator');
const { ErrorResponse } = require('../middleware/error');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract the first error message
    const message = errors.array().map((err) => err.msg).join(', ');
    return next(new ErrorResponse(message, 400));
  }
  next();
};

module.exports = validate;
