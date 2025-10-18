const UserService = require('../services/userService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const result = await UserService.getAllUsers(req.query);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Users retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(user, 'User retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.created(user, 'User created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(id, req.body);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedUser, 'User updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'User deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.toggleUserStatus(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedUser, 'User status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req, res, next) {
    try {
      const stats = await UserService.getUserStats();
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(stats, 'User statistics retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;