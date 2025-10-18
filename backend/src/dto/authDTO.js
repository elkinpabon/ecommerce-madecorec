const Joi = require('joi');

class AuthDTO {
  static registerSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).required().trim(),
    last_name: Joi.string().min(2).max(100).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    address: Joi.string().max(500).optional().trim(),
    city: Joi.string().max(100).optional().trim(),
    country: Joi.string().max(100).optional().trim()
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required()
  });

  static changePasswordSchema = Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
  });

  static forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim()
  });

  static resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
  });

  static validateRegister(data) {
    return this.registerSchema.validate(data);
  }

  static validateLogin(data) {
    return this.loginSchema.validate(data);
  }

  static validateChangePassword(data) {
    return this.changePasswordSchema.validate(data);
  }

  static validateForgotPassword(data) {
    return this.forgotPasswordSchema.validate(data);
  }

  static validateResetPassword(data) {
    return this.resetPasswordSchema.validate(data);
  }

  static sanitizeUserResponse(user) {
    const { password, ...userWithoutPassword } = user.toJSON ? user.toJSON() : user;
    return userWithoutPassword;
  }
}

module.exports = AuthDTO;