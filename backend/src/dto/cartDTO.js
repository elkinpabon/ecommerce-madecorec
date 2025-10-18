const Joi = require('joi');

class CartDTO {
  static addItemSchema = Joi.object({
    product_id: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(999).required()
  });

  static updateItemSchema = Joi.object({
    quantity: Joi.number().integer().min(1).max(999).required()
  });

  static removeItemSchema = Joi.object({
    product_id: Joi.number().integer().min(1).required()
  });

  static validateAddItem(data) {
    return this.addItemSchema.validate(data);
  }

  static validateUpdateItem(data) {
    return this.updateItemSchema.validate(data);
  }

  static validateRemoveItem(data) {
    return this.removeItemSchema.validate(data);
  }

  static formatCartResponse(cart) {
    const cartData = cart.toJSON ? cart.toJSON() : cart;
    
    return {
      id: cartData.id,
      user_id: cartData.user_id,
      total_items: cartData.total_items,
      subtotal: parseFloat(cartData.subtotal),
      items: cartData.items ? cartData.items.map(item => this.formatCartItemResponse(item)) : [],
      last_activity: cartData.last_activity,
      created_at: cartData.created_at,
      updated_at: cartData.updated_at
    };
  }

  static formatCartItemResponse(item) {
    const itemData = item.toJSON ? item.toJSON() : item;
    
    return {
      id: itemData.id,
      product_id: itemData.product_id,
      quantity: itemData.quantity,
      unit_price: parseFloat(itemData.unit_price),
      total_price: parseFloat(itemData.total_price),
      product: itemData.product ? {
        id: itemData.product.id,
        name: itemData.product.name,
        sku: itemData.product.sku,
        price: parseFloat(itemData.product.price),
        images: itemData.product.images || [],
        slug: itemData.product.slug,
        stock_quantity: itemData.product.stock_quantity,
        status: itemData.product.status
      } : null
    };
  }
}

module.exports = CartDTO;