const { Payment, Order, User } = require('../models');
const { HTTP_STATUS, PAYMENT_STATUS, ORDER_STATUS } = require('../utils/constants');
const axios = require('axios');
const config = require('../config/server');

class PaymentService {
  static async createPayment(orderId, returnUrl, cancelUrl) {
    try {
      // Get order details
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'first_name', 'last_name']
          }
        ]
      });

      if (!order) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Order not found' };
      }

      if (order.status !== ORDER_STATUS.PENDING) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Order is not pending payment' };
      }

      // Check if payment already exists
      let payment = await Payment.findOne({ where: { order_id: orderId } });
      
      if (payment && payment.status === PAYMENT_STATUS.COMPLETED) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Order already paid' };
      }

      // Generate client transaction ID
      const clientTransactionId = `${order.order_number}-${Date.now()}`;

      // Prepare PayPhone request
      const payphoneRequest = {
        amount: parseFloat(order.total_amount),
        amountWithoutTax: parseFloat(order.subtotal),
        tax: parseFloat(order.tax_amount),
        service: parseFloat(order.shipping_amount),
        tip: 0,
        currency: order.currency || 'USD',
        reference: order.order_number,
        clientTransactionId: clientTransactionId,
        description: `Pago de orden ${order.order_number} - ${order.user.first_name} ${order.user.last_name}`,
        email: order.user.email,
        phoneNumber: order.shipping_address.phone || null
      };

      // Call PayPhone API
      const payphoneResponse = await this.callPayPhoneAPI(payphoneRequest);

      if (!payphoneResponse.success) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Payment initialization failed' };
      }

      // Create or update payment record
      if (payment) {
        await payment.update({
          status: PAYMENT_STATUS.PENDING,
          transaction_id: clientTransactionId,
          payphone_transaction_id: payphoneResponse.transactionId,
          payphone_response: payphoneResponse,
          payment_url: payphoneResponse.paymentUrl,
          expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
          paid_at: null,
          failed_at: null,
          failure_reason: null
        });
      } else {
        payment = await Payment.create({
          order_id: orderId,
          payment_method: 'PAYPHONE',
          status: PAYMENT_STATUS.PENDING,
          amount: order.total_amount,
          currency: order.currency,
          transaction_id: clientTransactionId,
          payphone_transaction_id: payphoneResponse.transactionId,
          payphone_response: payphoneResponse,
          payment_url: payphoneResponse.paymentUrl,
          expires_at: new Date(Date.now() + 30 * 60 * 1000)
        });
      }

      return payment;
    } catch (error) {
      throw error;
    }
  }

  static async processWebhook(webhookData) {
    try {
      const { transactionId, clientTransactionId, transactionStatus, transactionValue, reference } = webhookData;

      // Find payment by client transaction ID
      const payment = await Payment.findOne({
        where: { transaction_id: clientTransactionId },
        include: [
          {
            model: Order,
            as: 'order'
          }
        ]
      });

      if (!payment) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Payment not found' };
      }

      // Update payment based on status
      let paymentStatus;
      let orderStatus;
      const updateData = {
        payphone_transaction_id: transactionId,
        payphone_reference: reference
      };

      switch (transactionStatus.toLowerCase()) {
        case 'approved':
        case 'completed':
          paymentStatus = PAYMENT_STATUS.COMPLETED;
          orderStatus = ORDER_STATUS.CONFIRMED;
          updateData.paid_at = new Date();
          updateData.status = paymentStatus;
          break;
        
        case 'failed':
        case 'error':
          paymentStatus = PAYMENT_STATUS.FAILED;
          updateData.failed_at = new Date();
          updateData.failure_reason = `PayPhone transaction failed: ${transactionStatus}`;
          updateData.status = paymentStatus;
          break;
        
        case 'cancelled':
          paymentStatus = PAYMENT_STATUS.CANCELLED;
          updateData.failed_at = new Date();
          updateData.failure_reason = 'Payment cancelled by user';
          updateData.status = paymentStatus;
          break;
        
        default:
          // Keep as pending for unknown statuses
          return payment;
      }

      // Update payment
      await payment.update(updateData);

      // Update order status if payment completed
      if (orderStatus) {
        await payment.order.update({ status: orderStatus });
      }

      return payment;
    } catch (error) {
      throw error;
    }
  }

  static async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [
          {
            model: Order,
            as: 'order',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email']
              }
            ]
          }
        ]
      });

      if (!payment) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Payment not found' };
      }

      return payment;
    } catch (error) {
      throw error;
    }
  }

  static async getPaymentByOrderId(orderId) {
    try {
      const payment = await Payment.findOne({
        where: { order_id: orderId },
        include: [
          {
            model: Order,
            as: 'order',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email']
              }
            ]
          }
        ]
      });

      if (!payment) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Payment not found' };
      }

      return payment;
    } catch (error) {
      throw error;
    }
  }

  static async getAllPayments(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        payment_method,
        date_from,
        date_to,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Filter by status
      if (status) {
        whereClause.status = status;
      }

      // Filter by payment method
      if (payment_method) {
        whereClause.payment_method = payment_method;
      }

      // Filter by date range
      if (date_from || date_to) {
        whereClause.created_at = {};
        if (date_from) whereClause.created_at[Op.gte] = new Date(date_from);
        if (date_to) whereClause.created_at[Op.lte] = new Date(date_to);
      }

      const { count, rows } = await Payment.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Order,
            as: 'order',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]]
      });

      return {
        payments: rows,
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

  static async callPayPhoneAPI(paymentData) {
    try {
      const response = await axios.post(`${config.payphone.apiUrl}/button/`, {
        ...paymentData,
        storeId: config.payphone.storeId
      }, {
        headers: {
          'Authorization': `Bearer ${config.payphone.clientSecret}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('PayPhone API Error:', error.response?.data || error.message);
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Payment service unavailable' };
    }
  }

  static async getPaymentStats() {
    try {
      const totalPayments = await Payment.count();
      const completedPayments = await Payment.count({ where: { status: PAYMENT_STATUS.COMPLETED } });
      const pendingPayments = await Payment.count({ where: { status: PAYMENT_STATUS.PENDING } });
      const failedPayments = await Payment.count({ where: { status: PAYMENT_STATUS.FAILED } });
      const cancelledPayments = await Payment.count({ where: { status: PAYMENT_STATUS.CANCELLED } });

      const totalRevenue = await Payment.sum('amount', {
        where: { status: PAYMENT_STATUS.COMPLETED }
      });

      return {
        total: totalPayments,
        completed: completedPayments,
        pending: pendingPayments,
        failed: failedPayments,
        cancelled: cancelledPayments,
        total_revenue: totalRevenue || 0,
        success_rate: totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw error;
    }
  }

    static async getPaymentByTransactionId(transactionId) {
    try {
      const payment = await Payment.findOne({
        where: { transaction_id: transactionId },
        include: [
          {
            model: Order,
            as: 'order',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email']
              }
            ]
          }
        ]
      });

      if (!payment) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Payment not found' };
      }

      return payment;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = PaymentService;