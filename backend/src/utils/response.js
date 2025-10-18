const { HTTP_STATUS } = require('./constants');

class ApiResponse {
  static success(data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  static error(message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return {
      success: false,
      message,
      errors,
      statusCode
    };
  }

  static created(data = null, message = 'Created successfully') {
    return this.success(data, message, HTTP_STATUS.CREATED);
  }

  static notFound(message = 'Resource not found') {
    return this.error(message, HTTP_STATUS.NOT_FOUND);
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(message = 'Forbidden') {
    return this.error(message, HTTP_STATUS.FORBIDDEN);
  }

  static badRequest(message = 'Bad request', errors = null) {
    return this.error(message, HTTP_STATUS.BAD_REQUEST, errors);
  }

  static conflict(message = 'Conflict') {
    return this.error(message, HTTP_STATUS.CONFLICT);
  }
}

module.exports = ApiResponse;