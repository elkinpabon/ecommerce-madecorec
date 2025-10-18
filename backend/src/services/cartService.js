const { Cart, CartItem, Product } = require('../models');
const { HTTP_STATUS, PRODUCT_STATUS } = require('../utils/constants');
const { formatPrice } = require('../utils/helpers');
const { Op } = require('sequelize');

class CartService {
  static async getCart(userId) {
    try {
      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku', 'price', 'images', 'slug', 'stock_quantity', 'status']
              }
            ]
          }
        ]
      });

      // Create cart if it doesn't exist
      if (!cart) {
        cart = await Cart.create({
          user_id: userId,
          total_items: 0,
          subtotal: 0.00
        });
        
        // Reload with items
        cart = await Cart.findOne({
          where: { user_id: userId },
          include: [
            {
              model: CartItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['id', 'name', 'sku', 'price', 'images', 'slug', 'stock_quantity', 'status']
                }
              ]
            }
          ]
        });
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

  static async addItem(userId, productId, quantity) {
    try {
      // Verify product exists and is available
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Product not found' };
      }

      if (product.status !== PRODUCT_STATUS.ACTIVE) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Product is not available' };
      }

      if (product.stock_quantity < quantity) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Insufficient stock available' };
      }

      // Get or create cart
      let cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        cart = await Cart.create({
          user_id: userId,
          total_items: 0,
          subtotal: 0.00
        });
      }

      // Check if item already exists in cart
      let cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id: productId }
      });

      if (cartItem) {
        // Update existing item
        const newQuantity = cartItem.quantity + quantity;
        
        if (product.stock_quantity < newQuantity) {
          throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Insufficient stock for requested quantity' };
        }

        await cartItem.update({
          quantity: newQuantity,
          total_price: formatPrice(product.price * newQuantity)
        });
      } else {
        // Create new item
        cartItem = await CartItem.create({
          cart_id: cart.id,
          product_id: productId,
          quantity,
          unit_price: product.price,
          total_price: formatPrice(product.price * quantity)
        });
      }

      // Update cart totals
      await this.updateCartTotals(cart.id);

      // Return updated cart
      return await this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async updateItem(userId, productId, quantity) {
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Cart not found' };
      }

      const cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id: productId },
        include: [{ model: Product, as: 'product' }]
      });

      if (!cartItem) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Item not found in cart' };
      }

      // Verify stock availability
      if (cartItem.product.stock_quantity < quantity) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Insufficient stock available' };
      }

      // Update item
      await cartItem.update({
        quantity,
        total_price: formatPrice(cartItem.unit_price * quantity)
      });

      // Update cart totals
      await this.updateCartTotals(cart.id);

      // Return updated cart
      return await this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async removeItem(userId, productId) {
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Cart not found' };
      }

      const cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id: productId }
      });

      if (!cartItem) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Item not found in cart' };
      }

      // Remove item
      await cartItem.destroy();

      // Update cart totals
      await this.updateCartTotals(cart.id);

      // Return updated cart
      return await this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Cart not found' };
      }

      // Remove all items
      await CartItem.destroy({ where: { cart_id: cart.id } });

      // Reset cart totals
      await cart.update({
        total_items: 0,
        subtotal: 0.00,
        last_activity: new Date()
      });

      return await this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async updateCartTotals(cartId) {
    try {
      const cartItems = await CartItem.findAll({
        where: { cart_id: cartId }
      });

      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

      await Cart.update(
        {
          total_items: totalItems,
          subtotal: formatPrice(subtotal),
          last_activity: new Date()
        },
        { where: { id: cartId } }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async validateCartItems(userId) {
    try {
      const cart = await this.getCart(userId);
      const validationResults = [];
      let hasChanges = false;

      for (const item of cart.items) {
        const product = item.product;
        const result = {
          product_id: product.id,
          name: product.name,
          requested_quantity: item.quantity,
          available_quantity: product.stock_quantity,
          is_available: product.status === PRODUCT_STATUS.ACTIVE,
          price_changed: parseFloat(item.unit_price) !== parseFloat(product.price),
          current_price: parseFloat(product.price),
          cart_price: parseFloat(item.unit_price)
        };

        // Check if product is still available
        if (!result.is_available) {
          await this.removeItem(userId, product.id);
          result.action = 'removed';
          hasChanges = true;
        }
        // Check if price changed
        else if (result.price_changed) {
          await CartItem.update(
            {
              unit_price: product.price,
              total_price: formatPrice(product.price * item.quantity)
            },
            { where: { id: item.id } }
          );
          result.action = 'price_updated';
          hasChanges = true;
        }
        // Check stock availability
        else if (result.available_quantity < result.requested_quantity) {
          if (result.available_quantity > 0) {
            await this.updateItem(userId, product.id, result.available_quantity);
            result.action = 'quantity_reduced';
            result.new_quantity = result.available_quantity;
          } else {
            await this.removeItem(userId, product.id);
            result.action = 'removed';
          }
          hasChanges = true;
        } else {
          result.action = 'no_change';
        }

        validationResults.push(result);
      }

      if (hasChanges) {
        await this.updateCartTotals(cart.id);
      }

      return {
        has_changes: hasChanges,
        validation_results: validationResults,
        updated_cart: hasChanges ? await this.getCart(userId) : cart
      };
    } catch (error) {
      throw error;
    }
  }

  static async getCartItemCount(userId) {
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });
      return cart ? cart.total_items : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;