const Joi = require('joi');
const { ORDER_STATUS } = require('../utils/constants');

class OrderDTO {
  static createOrderSchema = Joi.object({
    shipping_address: Joi.object({
      first_name: Joi.string().min(2).max(100).required(),
      last_name: Joi.string().min(2).max(100).required(),
      address_line_1: Joi.string().min(5).max(255).required(),
      address_line_2: Joi.string().max(255).optional(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().max(100).optional(),
      postal_code: Joi.string().max(20).optional(),
      country: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional()
    }).required(),
    billing_address: Joi.object({
      first_name: Joi.string().min(2).max(100).required(),
      last_name: Joi.string().min(2).max(100).required(),
      address_line_1: Joi.string().min(5).max(255).required(),
      address_line_2: Joi.string().max(255).optional(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().max(100).optional(),
      postal_code: Joi.string().max(20).optional(),
      country: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional()
    }).optional(),
    notes: Joi.string().max(1000).optional(),
    use_shipping_as_billing: Joi.boolean().default(true)
  });

  static updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid(...Object.values(ORDER_STATUS)).required(),
    notes: Joi.string().max(1000).optional()
  });

  static queryOrdersSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid(...Object.values(ORDER_STATUS)).optional(),
    user_id: Joi.number().integer().min(1).optional(),
    order_number: Joi.string().max(50).optional(),
    date_from: Joi.date().optional(),
    date_to: Joi.date().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'order_number', 'total_amount').default('created_at'),
    sort_order: Joi.string().valid('ASC', 'DESC').default('DESC')
  });

  static validateCreateOrder(data) {
    return this.createOrderSchema.validate(data);
  }

  static validateUpdateOrderStatus(data) {
    return this.updateOrderStatusSchema.validate(data);
  }

  static validateQueryOrders(data) {
    return this.queryOrdersSchema.validate(data);
  }

  static formatOrderResponse(order) {
    const orderData = order.toJSON ? order.toJSON() : order;
    
    return {
      id: orderData.id,
      order_number: orderData.order_number,
      user_id: orderData.user_id,
      status: orderData.status,
      subtotal: parseFloat(orderData.subtotal),
      tax_amount: parseFloat(orderData.tax_amount),
      shipping_amount: parseFloat(orderData.shipping_amount),
      discount_amount: parseFloat(orderData.discount_amount),
      total_amount: parseFloat(orderData.total_amount),
      currency: orderData.currency,
      shipping_address: orderData.shipping_address,
      billing_address: orderData.billing_address,
      notes: orderData.notes,
      items: orderData.items ? orderData.items.map(item => this.formatOrderItemResponse(item)) : [],
      payment: orderData.payment ? this.formatOrderPaymentResponse(orderData.payment) : null,
      user: orderData.user ? {
        id: orderData.user.id,
        first_name: orderData.user.first_name,
        last_name: orderData.user.last_name,
        email: orderData.user.email
      } : null,
      shipped_at: orderData.shipped_at,
      delivered_at: orderData.delivered_at,
      cancelled_at: orderData.cancelled_at,
      cancellation_reason: orderData.cancellation_reason,
      created_at: orderData.created_at,
      updated_at: orderData.updated_at
    };
  }

  static formatOrderItemResponse(item) {
    const itemData = item.toJSON ? item.toJSON() : item;
    
    return {
      id: itemData.id,
      product_id: itemData.product_id,
      product_name: itemData.product_name,
      product_sku: itemData.product_sku,
      quantity: itemData.quantity,
      unit_price: parseFloat(itemData.unit_price),
      total_price: parseFloat(itemData.total_price),
      product_snapshot: itemData.product_snapshot,
      product: itemData.product ? {
        id: itemData.product.id,
        name: itemData.product.name,
        images: itemData.product.images || [],
        slug: itemData.product.slug
      } : null
    };
  }

  static formatOrderPaymentResponse(payment) {
    const paymentData = payment.toJSON ? payment.toJSON() : payment;
    
    return {
      id: paymentData.id,
      payment_method: paymentData.payment_method,
      status: paymentData.status,
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency,
      transaction_id: paymentData.transaction_id,
      paid_at: paymentData.paid_at,
      failed_at: paymentData.failed_at,
      failure_reason: paymentData.failure_reason
    };
  }

  static formatOrdersResponse(orders) {
    return orders.map(order => this.formatOrderResponse(order));
  }
}

module.exports = OrderDTO;