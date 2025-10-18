const { User } = require('../models');
const { hashPassword } = require('../utils/helpers');
const { HTTP_STATUS, USER_ROLES } = require('../utils/constants');
const { Op } = require('sequelize');

class UserService {
  static async getAllUsers(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        is_active,
        email_verified,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Search functionality
      if (search) {
        whereClause[Op.or] = [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      // Filter by role
      if (role) {
        whereClause.role = role;
      }

      // Filter by active status
      if (typeof is_active === 'boolean') {
        whereClause.is_active = is_active;
      }

      // Filter by email verification
      if (typeof email_verified === 'boolean') {
        whereClause.email_verified = email_verified;
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]]
      });

      return {
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
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

  static async createUser(userData) {
    try {
      const { email, password, ...otherData } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw { statusCode: HTTP_STATUS.CONFLICT, message: 'User already exists with this email' };
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await User.create({
        ...otherData,
        email,
        password: hashedPassword
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'User not found' };
      }

      // If updating email, check if it's already taken
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({
          where: { email: updateData.email, id: { [Op.ne]: userId } }
        });
        if (existingUser) {
          throw { statusCode: HTTP_STATUS.CONFLICT, message: 'Email already exists' };
        }
      }

      // If updating password, hash it
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
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

  static async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'User not found' };
      }

      // Soft delete by deactivating the user
      await user.update({ is_active: false });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async toggleUserStatus(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'User not found' };
      }

      await user.update({ is_active: !user.is_active });

      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async getUserStats() {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { is_active: true } });
      const inactiveUsers = await User.count({ where: { is_active: false } });
      const adminUsers = await User.count({ where: { role: USER_ROLES.ADMIN } });
      const regularUsers = await User.count({ where: { role: USER_ROLES.USER } });
      const verifiedUsers = await User.count({ where: { email_verified: true } });

      return {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        admins: adminUsers,
        regular: regularUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;