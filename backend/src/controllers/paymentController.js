const PaymentService = require('../services/paymentService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS, USER_ROLES } = require('../utils/constants');

class PaymentController {
  static async createPayment(req, res, next) {
    try {
      const { order_id, return_url, cancel_url } = req.body;
      const payment = await PaymentService.createPayment(order_id, return_url, cancel_url);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.created(payment, 'Payment created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentById(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);

      // Check if user can access this payment
      if (req.user.role !== USER_ROLES.ADMIN && payment.order.user_id !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('You can only access your own payments')
        );
      }
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(payment, 'Payment retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentByOrderId(req, res, next) {
    try {
      const { orderId } = req.params;
      const payment = await PaymentService.getPaymentByOrderId(orderId);

      // Check if user can access this payment
      if (req.user.role !== USER_ROLES.ADMIN && payment.order.user_id !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('You can only access your own payments')
        );
      }
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(payment, 'Payment retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllPayments(req, res, next) {
    try {
      const result = await PaymentService.getAllPayments(req.query);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Payments retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(req, res, next) {
    try {
      // PayPhone webhook handler
      const webhookData = req.body;
      const payment = await PaymentService.processWebhook(webhookData);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(payment, 'Webhook processed successfully')
      );
    } catch (error) {
      // Log webhook errors but don't expose details
      console.error('Webhook processing error:', error);
      
      // Always return success to prevent webhook retries
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Webhook received')
      );
    }
  }

  static async getPaymentStats(req, res, next) {
    try {
      const stats = await PaymentService.getPaymentStats();
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(stats, 'Payment statistics retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async retryPayment(req, res, next) {
    try {
      const { orderId } = req.params;
      const { return_url, cancel_url } = req.body;
      
      const payment = await PaymentService.createPayment(orderId, return_url, cancel_url);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(payment, 'Payment retry initiated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentStatus(req, res, next) {
    try {
      const { transactionId } = req.params;
      
      // Find payment by transaction ID
      const payment = await PaymentService.getPaymentByTransactionId(transactionId);
      
      if (!payment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Payment not found')
        );
      }

      // Check if user can access this payment
      if (req.user.role !== USER_ROLES.ADMIN && payment.order.user_id !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('You can only access your own payments')
        );
      }
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success({
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          order_number: payment.order.order_number,
          created_at: payment.created_at,
          paid_at: payment.paid_at,
          failed_at: payment.failed_at,
          failure_reason: payment.failure_reason
        }, 'Payment status retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;