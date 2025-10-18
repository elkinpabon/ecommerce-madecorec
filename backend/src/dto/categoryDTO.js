const Joi = require('joi');

class CategoryDTO {
  static createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000).optional(),
    image_url: Joi.string().uri().max(500).optional(),
    is_active: Joi.boolean().default(true),
    sort_order: Joi.number().integer().min(0).default(0)
  });

  static updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(1000).optional(),
    image_url: Joi.string().uri().max(500).optional(),
    is_active: Joi.boolean().optional(),
    sort_order: Joi.number().integer().min(0).optional()
  });

  static queryCategoriesSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().max(100).optional(),
    is_active: Joi.boolean().optional(),
    sort_by: Joi.string().valid('name', 'sort_order', 'created_at').default('sort_order'),
    sort_order: Joi.string().valid('ASC', 'DESC').default('ASC')
  });

  static validateCreateCategory(data) {
    return this.createCategorySchema.validate(data);
  }

  static validateUpdateCategory(data) {
    return this.updateCategorySchema.validate(data);
  }

  static validateQueryCategories(data) {
    return this.queryCategoriesSchema.validate(data);
  }

  static formatCategoryResponse(category) {
    const categoryData = category.toJSON ? category.toJSON() : category;
    
    return {
      id: categoryData.id,
      name: categoryData.name,
      description: categoryData.description,
      slug: categoryData.slug,
      image_url: categoryData.image_url,
      is_active: categoryData.is_active,
      sort_order: categoryData.sort_order,
      products_count: categoryData.products ? categoryData.products.length : 0,
      created_at: categoryData.created_at,
      updated_at: categoryData.updated_at
    };
  }

  static formatCategoriesResponse(categories) {
    return categories.map(category => this.formatCategoryResponse(category));
  }
}

module.exports = CategoryDTO;