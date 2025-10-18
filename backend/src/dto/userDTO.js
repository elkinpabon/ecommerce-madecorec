const Joi = require('joi');
const { USER_ROLES } = require('../utils/constants');

class UserDTO {
  static updateProfileSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).optional().trim(),
    last_name: Joi.string().min(2).max(100).optional().trim(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    address: Joi.string().max(500).optional().trim(),
    city: Joi.string().max(100).optional().trim(),
    country: Joi.string().max(100).optional().trim()
  });

  static updateUserSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).optional().trim(),
    last_name: Joi.string().min(2).max(100).optional().trim(),
    email: Joi.string().email().optional().lowercase().trim(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    address: Joi.string().max(500).optional().trim(),
    city: Joi.string().max(100).optional().trim(),
    country: Joi.string().max(100).optional().trim(),
    role: Joi.string().valid(...Object.values(USER_ROLES)).optional(),
    is_active: Joi.boolean().optional(),
    email_verified: Joi.boolean().optional()
  });

  static queryUsersSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(255).optional().trim(),
    role: Joi.string().valid(...Object.values(USER_ROLES)).optional(),
    is_active: Joi.boolean().optional(),
    email_verified: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'email', 'first_name', 'last_name').default('created_at'),
    sort_order: Joi.string().valid('ASC', 'DESC').default('DESC')
  });

  static validateUpdateProfile(data) {
    return this.updateProfileSchema.validate(data);
  }

  static validateUpdateUser(data) {
    return this.updateUserSchema.validate(data);
  }

  static validateQueryUsers(data) {
    return this.queryUsersSchema.validate(data);
  }

  static sanitizeUserResponse(user) {
    const { password, ...userWithoutPassword } = user.toJSON ? user.toJSON() : user;
    return userWithoutPassword;
  }

  static sanitizeUsersResponse(users) {
    return users.map(user => this.sanitizeUserResponse(user));
  }
}

module.exports = UserDTO;