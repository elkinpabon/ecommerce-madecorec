const { User, Cart } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');
const { validateEmail, validatePassword } = require('../utils/validation');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS, USER_ROLES } = require('../utils/constants');

class AuthService {
  static async register(userData) {
    try {
      const { first_name, last_name, email, password, phone, address, city, country } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw { statusCode: HTTP_STATUS.CONFLICT, message: 'User already exists with this email' };
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || 'Ecuador',
        role: USER_ROLES.USER
      });

      // Create cart for user
      await Cart.create({
        user_id: user.id,
        total_items: 0,
        subtotal: 0.00
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();

      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid credentials' };
      }

      // Check if user is active
      if (!user.is_active) {
        throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: 'Account is deactivated' };
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid credentials' };
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();

      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'User not found' };
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Current password is incorrect' };
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await user.update({ password: hashedNewPassword });

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'User not found' };
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'User not found' };
      }

      // Update user
      await user.update(updateData);

      // Return updated user without password
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user || !user.is_active) {
        throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: 'User not found or inactive' };
      }

      // Generate new token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return {
        user,
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;