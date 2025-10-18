const express = require('express');
const CategoryController = require('../controllers/categoryController');
const CategoryDTO = require('../dto/categoryDTO');
const { validateBody, validateQuery } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const Joi = require('joi');

const router = express.Router();

// Public routes
router.get('/active', CategoryController.getActiveCategories);

router.get('/', 
  validateQuery(CategoryDTO.queryCategoriesSchema), 
  CategoryController.getAllCategories
);

router.get('/slug/:slug', CategoryController.getCategoryBySlug);

router.get('/:id', 
  validateQuery(Joi.object({
    id: Joi.number().integer().min(1).required()
  })), 
  CategoryController.getCategoryById
);

// Protected routes (Admin only)
router.use(authMiddleware);
router.use(requireAdmin);

// Create new category
router.post('/', 
  validateBody(CategoryDTO.createCategorySchema), 
  CategoryController.createCategory
);

// Update category
router.put('/:id', 
  validateBody(CategoryDTO.updateCategorySchema), 
  CategoryController.updateCategory
);

// Toggle category status
router.patch('/:id/toggle-status', CategoryController.toggleCategoryStatus);

// Delete category
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;