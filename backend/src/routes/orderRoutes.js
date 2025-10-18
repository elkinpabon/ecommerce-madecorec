const express = require('express');
const OrderController = require('../controllers/orderController');
const OrderDTO = require('../dto/orderDTO');
const { validateBody, validateQuery } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const Joi = require('joi');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User routes (authenticated users can access their own orders)
router.get('/my-orders', 
  validateQuery(OrderDTO.queryOrdersSchema), 
  OrderController.getUserOrders
);

router.get('/number/:orderNumber', OrderController.getOrderByNumber);

router.get('/:id', OrderController.getOrderById);

// Create new order
router.post('/', 
  validateBody(OrderDTO.createOrderSchema), 
  OrderController.createOrder
);

// Cancel order (users can cancel their own orders)
router.patch('/:id/cancel', 
  validateBody(Joi.object({
    reason: Joi.string().max(500).optional()
  })), 
  OrderController.cancelOrder
);

// Admin routes
router.get('/admin/all', 
  requireAdmin,
  validateQuery(OrderDTO.queryOrdersSchema), 
  OrderController.getAllOrders
);

router.get('/admin/stats', 
  requireAdmin,
  OrderController.getOrderStats
);

router.patch('/admin/:id/status', 
  requireAdmin,
  validateBody(OrderDTO.updateOrderStatusSchema), 
  OrderController.updateOrderStatus
);

module.exports = router;