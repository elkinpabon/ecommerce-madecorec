const express = require('express');
const UserController = require('../controllers/userController');
const UserDTO = require('../dto/userDTO');
const { validateBody, validateQuery } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const Joi = require('joi');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Admin only routes
router.use(requireAdmin);

// Get all users with pagination and filters
router.get('/', 
  validateQuery(UserDTO.queryUsersSchema), 
  UserController.getAllUsers
);

// Get user statistics
router.get('/stats', UserController.getUserStats);

// Get user by ID
router.get('/:id', 
  validateQuery(Joi.object({
    id: Joi.number().integer().min(1).required()
  })), 
  UserController.getUserById
);

// Create new user
router.post('/', 
  validateBody(UserDTO.updateUserSchema), 
  UserController.createUser
);

// Update user
router.put('/:id', 
  validateBody(UserDTO.updateUserSchema), 
  UserController.updateUser
);

// Toggle user status (activate/deactivate)
router.patch('/:id/toggle-status', UserController.toggleUserStatus);

// Delete user (soft delete)
router.delete('/:id', UserController.deleteUser);

module.exports = router;