const express = require('express');
const PaymentController = require('../controllers/paymentController');
const PaymentDTO = require('../dto/paymentDTO');
const { validateBody } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const Joi = require('joi');

const router = express.Router();

// Public webhook route (no authentication required)
router.post('/webhook/payphone', 
  validateBody(PaymentDTO.webhookPayphoneSchema), 
  PaymentController.handleWebhook
);

// Protected routes
router.use(authMiddleware);

// Create payment for order
router.post('/', 
  validateBody(PaymentDTO.createPaymentSchema), 
  PaymentController.createPayment
);

// Get payment by ID
router.get('/:id', PaymentController.getPaymentById);

// Get payment by order ID
router.get('/order/:orderId', PaymentController.getPaymentByOrderId);

// Get payment status by transaction ID
router.get('/status/:transactionId', PaymentController.getPaymentStatus);

// Retry payment for order
router.post('/retry/:orderId', 
  validateBody(Joi.object({
    return_url: Joi.string().uri().optional(),
    cancel_url: Joi.string().uri().optional()
  })), 
  PaymentController.retryPayment
);

// Admin routes
router.get('/admin/all', 
  requireAdmin,
  PaymentController.getAllPayments
);

router.get('/admin/stats', 
  requireAdmin,
  PaymentController.getPaymentStats
);

module.exports = router;