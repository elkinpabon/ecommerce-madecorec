const AuthService = require('../services/authService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.created(result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Logout successful')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const profile = await AuthService.getProfile(req.userId);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(profile, 'Profile retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updatedProfile = await AuthService.updateProfile(req.userId, req.body);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedProfile, 'Profile updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { current_password, new_password } = req.body;
      await AuthService.changePassword(req.userId, current_password, new_password);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Password changed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const result = await AuthService.refreshToken(req.userId);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Token refreshed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Password reset email sent (not implemented)')
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
     
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Password reset successful (not implemented)')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;