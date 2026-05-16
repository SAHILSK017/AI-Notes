class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Ensure the name is set to the class name
    this.name = this.constructor.name;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development environment
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  }

  // Handle specific Mongoose errors
  
  // 1. Invalid ID (CastError)
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = new ErrorResponse(message, 404);
  }

  // 2. Duplicate Key (e.g. unique field violation)
  if (err.code === 11000) {
    const message = 'The information provided already exists in our system';
    error = new ErrorResponse(message, 400);
  }

  // 3. Validation Errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Final standardized response
  const statusCode = error.statusCode || 500;
  const responseMessage = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
    data: null,
    // Include stack in dev for easier debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  ErrorResponse,
  errorHandler,
};
