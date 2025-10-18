const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/server');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized('Access token is required')
      );
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized('Access token is required')
      );
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized('User not found')
      );
    }

    if (!user.is_active) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized('User account is deactivated')
      );
    }

    // Add user to request object
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized('Invalid access token')
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized('Access token has expired')
      );
    }

    console.error('Auth middleware error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      ApiResponse.error('Authentication error')
    );
  }
};

module.exports = authMiddleware;