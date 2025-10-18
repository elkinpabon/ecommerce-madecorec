const CartService = require('../services/cartService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

class CartController {
  static async getCart(req, res, next) {
    try {
      const cart = await CartService.getCart(req.userId);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(cart, 'Cart retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req, res, next) {
    try {
      const { product_id, quantity } = req.body;
      const cart = await CartService.addItem(req.userId, product_id, quantity);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(cart, 'Item added to cart successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req, res, next) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const cart = await CartService.updateItem(req.userId, parseInt(productId), quantity);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(cart, 'Cart item updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req, res, next) {
    try {
      const { productId } = req.params;
      const cart = await CartService.removeItem(req.userId, parseInt(productId));
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(cart, 'Item removed from cart successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const cart = await CartService.clearCart(req.userId);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(cart, 'Cart cleared successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async validateCart(req, res, next) {
    try {
      const validation = await CartService.validateCartItems(req.userId);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(validation, 'Cart validation completed')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCartCount(req, res, next) {
    try {
      const count = await CartService.getCartItemCount(req.userId);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success({ count }, 'Cart item count retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;