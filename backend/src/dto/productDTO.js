const Joi = require('joi');
const { PRODUCT_STATUS } = require('../utils/constants');

class ProductDTO {
  static createProductSchema = Joi.object({
    name: Joi.string().min(2).max(200).required().trim(),
    description: Joi.string().optional().trim(),
    short_description: Joi.string().max(500).optional().trim(),
    sku: Joi.string().min(3).max(50).optional().trim(),
    price: Joi.number().precision(2).min(0).required(),
    compare_price: Joi.number().precision(2).min(0).optional(),
    cost_price: Joi.number().precision(2).min(0).optional(),
    stock_quantity: Joi.number().integer().min(0).required(),
    min_stock_level: Joi.number().integer().min(0).optional(),
    weight: Joi.number().precision(2).min(0).optional(),
    dimensions: Joi.string().max(100).optional().trim(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    category_id: Joi.number().integer().min(1).required(),
    status: Joi.string().valid(...Object.values(PRODUCT_STATUS)).optional(),
    is_featured: Joi.boolean().optional(),
    meta_title: Joi.string().max(255).optional().trim(),
    meta_description: Joi.string().optional().trim(),
    slug: Joi.string().min(2).max(250).optional().trim()
  });

  static updateProductSchema = Joi.object({
    name: Joi.string().min(2).max(200).optional().trim(),
    description: Joi.string().optional().trim(),
    short_description: Joi.string().max(500).optional().trim(),
    price: Joi.number().precision(2).min(0).optional(),
    compare_price: Joi.number().precision(2).min(0).optional(),
    cost_price: Joi.number().precision(2).min(0).optional(),
    stock_quantity: Joi.number().integer().min(0).optional(),
    min_stock_level: Joi.number().integer().min(0).optional(),
    weight: Joi.number().precision(2).min(0).optional(),
    dimensions: Joi.string().max(100).optional().trim(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    category_id: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid(...Object.values(PRODUCT_STATUS)).optional(),
    is_featured: Joi.boolean().optional(),
    meta_title: Joi.string().max(255).optional().trim(),
    meta_description: Joi.string().optional().trim(),
    slug: Joi.string().min(2).max(250).optional().trim()
  });

  static queryProductsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(12),
    search: Joi.string().max(255).optional().trim(),
    category_id: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid(...Object.values(PRODUCT_STATUS)).optional(),
    is_featured: Joi.boolean().optional(),
    min_price: Joi.number().precision(2).min(0).optional(),
    max_price: Joi.number().precision(2).min(0).optional(),
    in_stock: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name', 'price', 'stock_quantity').default('created_at'),
    sort_order: Joi.string().valid('ASC', 'DESC').default('DESC')
  });

  static validateCreateProduct(data) {
    return this.createProductSchema.validate(data);
  }

  static validateUpdateProduct(data) {
    return this.updateProductSchema.validate(data);
  }

  static validateQueryProducts(data) {
    return this.queryProductsSchema.validate(data);
  }

  static formatProductResponse(product) {
    const productData = product.toJSON ? product.toJSON() : product;
    
    return {
      ...productData,
      price: parseFloat(productData.price),
      compare_price: productData.compare_price ? parseFloat(productData.compare_price) : null,
      cost_price: productData.cost_price ? parseFloat(productData.cost_price) : null,
      is_on_sale: productData.compare_price && parseFloat(productData.price) < parseFloat(productData.compare_price),
      is_in_stock: productData.stock_quantity > 0,
      is_low_stock: productData.stock_quantity <= productData.min_stock_level
    };
  }

  static formatProductsResponse(products) {
    return products.map(product => this.formatProductResponse(product));
  }
}

module.exports = ProductDTO;