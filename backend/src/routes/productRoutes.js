const express = require('express');
const ProductController = require('../controllers/productController');
const ProductDTO = require('../dto/productDTO');
const { validateBody, validateQuery } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const Joi = require('joi');

const router = express.Router();

// Public routes
router.get('/', 
  validateQuery(ProductDTO.queryProductsSchema), 
  ProductController.getAllProducts
);

router.get('/featured', 
  validateQuery(Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(8)
  })), 
  ProductController.getFeaturedProducts
);

router.get('/search', 
  validateQuery(ProductDTO.queryProductsSchema), 
  ProductController.searchProducts
);

router.get('/slug/:slug', ProductController.getProductBySlug);

router.get('/:id', 
  validateQuery(Joi.object({
    id: Joi.number().integer().min(1).required()
  })), 
  ProductController.getProductById
);

// Protected routes (Admin only)
router.use(authMiddleware);
router.use(requireAdmin);

// Get product statistics
router.get('/admin/stats', ProductController.getProductStats);

// Create new product
router.post('/', 
  validateBody(ProductDTO.createProductSchema), 
  ProductController.createProduct
);

// Update product
router.put('/:id', 
  validateBody(ProductDTO.updateProductSchema), 
  ProductController.updateProduct
);

// Update product stock
router.patch('/:id/stock', 
  validateBody(Joi.object({
    quantity: Joi.number().integer().required()
  })), 
  ProductController.updateStock
);

// Delete product (soft delete)
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;