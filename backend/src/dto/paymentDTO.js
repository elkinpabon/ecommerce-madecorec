const Joi = require('joi');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../utils/constants');

class PaymentDTO {
  static createPaymentSchema = Joi.object({
    order_id: Joi.number().integer().min(1).required(),
    payment_method: Joi.string().valid(...Object.values(PAYMENT_METHODS)).default(PAYMENT_METHODS.PAYPHONE),
    return_url: Joi.string().uri().optional(),
    cancel_url: Joi.string().uri().optional()
  });

  static webhookPayphoneSchema = Joi.object({
    transactionId: Joi.string().required(),
    clientTransactionId: Joi.string().required(),
    transactionStatus: Joi.string().required(),
    transactionValue: Joi.number().required(),
    phoneNumber: Joi.string().optional(),
    reference: Joi.string().optional(),
    timestamp: Joi.string().required()
  });

  static validateCreatePayment(data) {
    return this.createPaymentSchema.validate(data);
  }

  static validatePayphoneWebhook(data) {
    return this.webhookPayphoneSchema.validate(data);
  }

  static formatPaymentResponse(payment) {
    const paymentData = payment.toJSON ? payment.toJSON() : payment;
    
    return {
      id: paymentData.id,
      order_id: paymentData.order_id,
      payment_method: paymentData.payment_method,
      status: paymentData.status,
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency,
      transaction_id: paymentData.transaction_id,
      payphone_transaction_id: paymentData.payphone_transaction_id,
      payphone_reference: paymentData.payphone_reference,
      payment_url: paymentData.payment_url,
      expires_at: paymentData.expires_at,
      paid_at: paymentData.paid_at,
      failed_at: paymentData.failed_at,
      failure_reason: paymentData.failure_reason,
      order: paymentData.order ? {
        id: paymentData.order.id,
        order_number: paymentData.order.order_number,
        total_amount: parseFloat(paymentData.order.total_amount),
        status: paymentData.order.status
      } : null,
      created_at: paymentData.created_at,
      updated_at: paymentData.updated_at
    };
  }

  static formatPaymentsResponse(payments) {
    return payments.map(payment => this.formatPaymentResponse(payment));
  }

  static formatPayphoneRequest(order, clientTransactionId) {
    return {
      amount: parseFloat(order.total_amount),
      amountWithoutTax: parseFloat(order.subtotal),
      amountWithTax: parseFloat(order.tax_amount),
      tax: parseFloat(order.tax_amount),
      service: parseFloat(order.shipping_amount),
      tip: 0,
      currency: order.currency || 'USD',
      reference: order.order_number,
      clientTransactionId: clientTransactionId,
      description: `Pago de orden ${order.order_number}`,
      email: order.user ? order.user.email : null,
      phoneNumber: order.shipping_address ? order.shipping_address.phone : null
    };
  }
}

module.exports = PaymentDTO;