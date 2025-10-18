const { Order, OrderItem, User, Product, Cart, CartItem } = require('../models');
const { generateOrderNumber, calculateTax, formatPrice } = require('../utils/helpers');
const { HTTP_STATUS, ORDER_STATUS, PRODUCT_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class OrderService {
  static async createOrder(userId, orderData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { shipping_address, billing_address, notes, use_shipping_as_billing = true } = orderData;

      // Get user's cart
      const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ],
        transaction
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Cart is empty' };
      }

      // Validate cart items availability and stock
      for (const item of cart.items) {
        const product = item.product;
        
        if (product.status !== PRODUCT_STATUS.ACTIVE) {
          throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: `Product ${product.name} is no longer available` };
        }
        
        if (product.stock_quantity < item.quantity) {
          throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}` };
        }
      }

      // Calculate order totals
      const subtotal = parseFloat(cart.subtotal);
      const tax_amount = calculateTax(subtotal);
      const shipping_amount = 0.00; // Free shipping for now
      const discount_amount = 0.00; // No discounts for now
      const total_amount = formatPrice(subtotal + tax_amount + shipping_amount - discount_amount);

      // Generate order number
      const order_number = generateOrderNumber();

      // Create order
      const order = await Order.create({
        order_number,
        user_id: userId,
        status: ORDER_STATUS.PENDING,
        subtotal,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        currency: 'USD',
        shipping_address,
        billing_address: use_shipping_as_billing ? shipping_address : billing_address,
        notes
      }, { transaction });

      // Create order items and update product stock
      for (const cartItem of cart.items) {
        const product = cartItem.product;
        
        // Create order item
        await OrderItem.create({
          order_id: order.id,
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          quantity: cartItem.quantity,
          unit_price: cartItem.unit_price,
          total_price: cartItem.total_price,
          product_snapshot: {
            name: product.name,
            description: product.description,
            images: product.images,
            price: product.price,
            sku: product.sku
          }
        }, { transaction });

        // Update product stock
        await product.update({
          stock_quantity: product.stock_quantity - cartItem.quantity,
          status: (product.stock_quantity - cartItem.quantity) === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : product.status
        }, { transaction });
      }

      // Clear cart
      await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
      await cart.update({
        total_items: 0,
        subtotal: 0.00,
        last_activity: new Date()
      }, { transaction });

      await transaction.commit();

      // Return order with full details
      return await this.getOrderById(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images', 'slug']
              }
            ]
          }
        ]
      });

      if (!order) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Order not found' };
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderByNumber(orderNumber) {
    try {
      const order = await Order.findOne({
        where: { order_number: orderNumber },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images', 'slug']
              }
            ]
          }
        ]
      });

      if (!order) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Order not found' };
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  static async getUserOrders(userId, queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        date_from,
        date_to,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereClause = { user_id: userId };

      // Filter by status
      if (status) {
        whereClause.status = status;
      }

      // Filter by date range
      if (date_from || date_to) {
        whereClause.created_at = {};
        if (date_from) whereClause.created_at[Op.gte] = new Date(date_from);
        if (date_to) whereClause.created_at[Op.lte] = new Date(date_to);
      }

      const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images', 'slug']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]]
      });

      return {
        orders: rows,
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

  static async getAllOrders(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        user_id,
        order_number,
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

      // Filter by user
      if (user_id) {
        whereClause.user_id = user_id;
      }

      // Filter by order number
      if (order_number) {
        whereClause.order_number = { [Op.like]: `%${order_number}%` };
      }

      // Filter by date range
      if (date_from || date_to) {
        whereClause.created_at = {};
        if (date_from) whereClause.created_at[Op.gte] = new Date(date_from);
        if (date_to) whereClause.created_at[Op.lte] = new Date(date_to);
      }

      const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images', 'slug']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]]
      });

      return {
        orders: rows,
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

  static async updateOrderStatus(orderId, status, notes) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Order not found' };
      }

      const updateData = { status };
      
      // Set timestamp based on status
      switch (status) {
        case ORDER_STATUS.SHIPPED:
          updateData.shipped_at = new Date();
          break;
        case ORDER_STATUS.DELIVERED:
          updateData.delivered_at = new Date();
          break;
        case ORDER_STATUS.CANCELLED:
          updateData.cancelled_at = new Date();
          updateData.cancellation_reason = notes;
          break;
      }

      if (notes && status !== ORDER_STATUS.CANCELLED) {
        updateData.notes = notes;
      }

      await order.update(updateData);

      // If cancelling order, restore product stock
      if (status === ORDER_STATUS.CANCELLED) {
        await this.restoreStock(orderId);
      }

      return await this.getOrderById(orderId);
    } catch (error) {
      throw error;
    }
  }

  static async restoreStock(orderId) {
    const transaction = await sequelize.transaction();
    
    try {
      const orderItems = await OrderItem.findAll({
        where: { order_id: orderId },
        include: [{ model: Product, as: 'product' }],
        transaction
      });

      for (const item of orderItems) {
        const product = item.product;
        const newStock = product.stock_quantity + item.quantity;
        
        await product.update({
          stock_quantity: newStock,
          status: newStock > 0 ? PRODUCT_STATUS.ACTIVE : product.status
        }, { transaction });
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getOrderStats() {
    try {
      const totalOrders = await Order.count();
      const pendingOrders = await Order.count({ where: { status: ORDER_STATUS.PENDING } });
      const confirmedOrders = await Order.count({ where: { status: ORDER_STATUS.CONFIRMED } });
      const processingOrders = await Order.count({ where: { status: ORDER_STATUS.PROCESSING } });
      const shippedOrders = await Order.count({ where: { status: ORDER_STATUS.SHIPPED } });
      const deliveredOrders = await Order.count({ where: { status: ORDER_STATUS.DELIVERED } });
      const cancelledOrders = await Order.count({ where: { status: ORDER_STATUS.CANCELLED } });

      const totalRevenue = await Order.sum('total_amount', {
        where: { status: { [Op.in]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.SHIPPED] } }
      });

      return {
        total: totalOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        total_revenue: totalRevenue || 0
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;