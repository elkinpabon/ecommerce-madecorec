const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const notFound = (req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json(
    ApiResponse.notFound(`Route ${req.method} ${req.originalUrl} not found`)
  );
};

module.exports = notFound;