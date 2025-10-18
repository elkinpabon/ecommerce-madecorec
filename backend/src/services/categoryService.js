const { Category, Product } = require('../models');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

class CategoryService {
  static async getAllCategories(queryParams) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        is_active,
        sort_by = 'sort_order',
        sort_order = 'ASC'
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Search functionality
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Filter by active status
      if (typeof is_active === 'boolean') {
        whereClause.is_active = is_active;
      }

      const { count, rows } = await Category.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id'],
            where: { status: 'ACTIVE' },
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]]
      });

      return {
        categories: rows,
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

  static async getCategoryById(categoryId) {
    try {
      const category = await Category.findByPk(categoryId, {
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'slug', 'price', 'images', 'status'],
            where: { status: 'ACTIVE' },
            required: false
          }
        ]
      });

      if (!category) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Category not found' };
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryBySlug(slug) {
    try {
      const category = await Category.findOne({
        where: { slug },
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'slug', 'price', 'images', 'status'],
            where: { status: 'ACTIVE' },
            required: false
          }
        ]
      });

      if (!category) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Category not found' };
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const { name, ...otherData } = categoryData;

      // Generate slug from name
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug already exists
      const existingSlug = await Category.findOne({ where: { slug } });
      if (existingSlug) {
        throw { statusCode: HTTP_STATUS.CONFLICT, message: 'Category name already exists' };
      }

      // Create category
      const category = await Category.create({
        name,
        slug,
        ...otherData
      });

      return category;
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(categoryId, updateData) {
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Category not found' };
      }

      // If updating name, regenerate slug
      if (updateData.name && updateData.name !== category.name) {
        const slug = updateData.name.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');

        // Check if new slug already exists
        const existingSlug = await Category.findOne({
          where: { slug, id: { [Op.ne]: categoryId } }
        });
        if (existingSlug) {
          throw { statusCode: HTTP_STATUS.CONFLICT, message: 'Category name already exists' };
        }

        updateData.slug = slug;
      }

      // Update category
      await category.update(updateData);

      return category;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCategory(categoryId) {
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Category not found' };
      }

      // Check if category has products
      const productCount = await Product.count({ where: { category_id: categoryId } });
      if (productCount > 0) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Cannot delete category with existing products' };
      }

      await category.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async toggleCategoryStatus(categoryId) {
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Category not found' };
      }

      await category.update({ is_active: !category.is_active });
      return category;
    } catch (error) {
      throw error;
    }
  }

  static async getActiveCategories() {
    try {
      const categories = await Category.findAll({
        where: { is_active: true },
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id'],
            where: { status: 'ACTIVE' },
            required: false
          }
        ]
      });

      return categories;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;