const express = require('express');
const CartController = require('../controllers/cartController');
const CartDTO = require('../dto/cartDTO');
const { validateBody } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const Joi = require('joi');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get users cart
router.get('/', CartController.getCart);

// Get cart item count
router.get('/count', CartController.getCartCount);

// Validate cart items (check availability, prices, stock)
router.get('/validate', CartController.validateCart);

// Add item to cart
router.post('/items', 
  validateBody(CartDTO.addItemSchema), 
  CartController.addItem
);

// Update cart item quantity
router.put('/items/:productId', 
  validateBody(CartDTO.updateItemSchema), 
  CartController.updateItem
);

// Remove item from cart
router.delete('/items/:productId', CartController.removeItem);

// Clear entire cart
router.delete('/', CartController.clearCart);

module.exports = router;