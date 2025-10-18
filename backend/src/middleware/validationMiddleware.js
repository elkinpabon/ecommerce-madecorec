const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const validationMiddleware = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        const errorDetails = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/['"]/g, ''),
          value: detail.context.value
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          ApiResponse.badRequest('Validation failed', errorDetails)
        );
      }

      // Replace the original data with validated and sanitized data
      req[property] = value;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error('Validation error')
      );
    }
  };
};

const validateBody = (schema) => validationMiddleware(schema, 'body');
const validateQuery = (schema) => validationMiddleware(schema, 'query');
const validateParams = (schema) => validationMiddleware(schema, 'params');

module.exports = {
  validationMiddleware,
  validateBody,
  validateQuery,
  validateParams
};