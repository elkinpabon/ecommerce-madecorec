const OrderService = require('../services/orderService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS, USER_ROLES } = require('../utils/constants');

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const order = await OrderService.createOrder(req.userId, req.body);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.created(order, 'Order created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);

      // Check if user can access this order
      if (req.user.role !== USER_ROLES.ADMIN && order.user_id !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('You can only access your own orders')
        );
      }
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(order, 'Order retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getOrderByNumber(req, res, next) {
    try {
      const { orderNumber } = req.params;
      const order = await OrderService.getOrderByNumber(orderNumber);

      // Check if user can access this order
      if (req.user.role !== USER_ROLES.ADMIN && order.user_id !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('You can only access your own orders')
        );
      }
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(order, 'Order retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrders(req, res, next) {
    try {
      // Users can only see their own orders, admins can see any users orders
      const userId = req.user.role === USER_ROLES.ADMIN && req.query.user_id 
        ? req.query.user_id 
        : req.userId;

      const result = await OrderService.getUserOrders(userId, req.query);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Orders retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    try {
      const result = await OrderService.getAllOrders(req.query);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Orders retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedOrder = await OrderService.updateOrderStatus(id, status, notes);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedOrder, 'Order status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStats(req, res, next) {
    try {
      const stats = await OrderService.getOrderStats();
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(stats, 'Order statistics retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const order = await OrderService.getOrderById(id);

      // Check if user can cancel this order
      if (req.user.role !== USER_ROLES.ADMIN && order.user_id !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('You can only cancel your own orders')
        );
      }

      const updatedOrder = await OrderService.updateOrderStatus(id, 'CANCELLED', reason);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedOrder, 'Order cancelled successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;