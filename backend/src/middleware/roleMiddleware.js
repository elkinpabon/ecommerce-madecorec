const { USER_ROLES } = require('../utils/constants');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          ApiResponse.unauthorized('Authentication required')
        );
      }

      // Ensure allowedRoles is an array
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Check if user's role is in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('Insufficient permissions')
        );
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error('Authorization error')
      );
    }
  };
};

// Helper functions for common role checks
const requireAdmin = roleMiddleware(USER_ROLES.ADMIN);
const requireUser = roleMiddleware([USER_ROLES.USER, USER_ROLES.ADMIN]);

module.exports = {
  roleMiddleware,
  requireAdmin,
  requireUser
};