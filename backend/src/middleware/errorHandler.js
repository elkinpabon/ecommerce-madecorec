const { ValidationError, DatabaseError, ConnectionError } = require('sequelize');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Sequelize Validation Error
  if (error instanceof ValidationError) {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      ApiResponse.badRequest('Validation failed', errors)
    );
  }

  // Sequelize Database Error
  if (error instanceof DatabaseError) {
    // Handle unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path || 'field';
      return res.status(HTTP_STATUS.CONFLICT).json(
        ApiResponse.conflict(`${field} already exists`)
      );
    }

    // Handle foreign key constraint violations
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        ApiResponse.badRequest('Referenced record does not exist')
      );
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      ApiResponse.error('Database error occurred')
    );
  }

  // Sequelize Connection Error
  if (error instanceof ConnectionError) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      ApiResponse.error('Database connection error')
    );
  }

  // JWT Errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      ApiResponse.unauthorized('Invalid token')
    );
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      ApiResponse.unauthorized('Token expired')
    );
  }

  // Custom API Errors
  if (error.statusCode) {
    return res.status(error.statusCode).json(
      ApiResponse.error(error.message, error.statusCode)
    );
  }

  // Default error
  const statusCode = error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong' 
    : error.message;

  return res.status(statusCode).json(
    ApiResponse.error(message, statusCode)
  );
};

module.exports = errorHandler;