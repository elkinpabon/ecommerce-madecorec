const { Product, Category } = require('../models');
const { generateSKU } = require('../utils/helpers');
const { HTTP_STATUS, PRODUCT_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

class ProductService {
  static async getAllProducts(queryParams) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        category_id,
        status,
        is_featured,
        min_price,
        max_price,
        in_stock,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Search functionality
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { sku: { [Op.like]: `%${search}%` } }
        ];
      }

      // Filter by category
      if (category_id) {
        whereClause.category_id = category_id;
      }

      // Filter by status
      if (status) {
        whereClause.status = status;
      }

      // Filter by featured
      if (typeof is_featured === 'boolean') {
        whereClause.is_featured = is_featured;
      }

      // Filter by price range
      if (min_price || max_price) {
        whereClause.price = {};
        if (min_price) whereClause.price[Op.gte] = min_price;
        if (max_price) whereClause.price[Op.lte] = max_price;
      }

      // Filter by stock
      if (typeof in_stock === 'boolean') {
        if (in_stock) {
          whereClause.stock_quantity = { [Op.gt]: 0 };
        } else {
          whereClause.stock_quantity = { [Op.lte]: 0 };
        }
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]]
      });

      return {
        products: rows,
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

  static async getProductById(productId) {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug', 'description']
          }
        ]
      });

      if (!product) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Product not found' };
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getProductBySlug(slug) {
    try {
      const product = await Product.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug', 'description']
          }
        ]
      });

      if (!product) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Product not found' };
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const { name, category_id, sku, ...otherData } = productData;

      // Verify category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Category not found' };
      }

      // Generate SKU if not provided
      const productSKU = sku || generateSKU(name, category_id);

      // Check if SKU already exists
      const existingSKU = await Product.findOne({ where: { sku: productSKU } });
      if (existingSKU) {
        throw { statusCode: HTTP_STATUS.CONFLICT, message: 'SKU already exists' };
      }

      // Generate slug if not provided
      const slug = otherData.slug || name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug already exists
      const existingSlug = await Product.findOne({ where: { slug } });
      if (existingSlug) {
        throw { statusCode: HTTP_STATUS.CONFLICT, message: 'Product slug already exists' };
      }

      // Create product
      const product = await Product.create({
        ...otherData,
        name,
        category_id,
        sku: productSKU,
        slug
      });

      // Load with category
      const createdProduct = await this.getProductById(product.id);
      return createdProduct;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, updateData) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Product not found' };
      }

      // If updating category, verify it exists
      if (updateData.category_id) {
        const category = await Category.findByPk(updateData.category_id);
        if (!category) {
          throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Category not found' };
        }
      }

      // If updating SKU, check if it's already taken
      if (updateData.sku && updateData.sku !== product.sku) {
        const existingSKU = await Product.findOne({
          where: { sku: updateData.sku, id: { [Op.ne]: productId } }
        });
        if (existingSKU) {
          throw { statusCode: HTTP_STATUS.CONFLICT, message: 'SKU already exists' };
        }
      }

      // If updating slug, check if it's already taken
      if (updateData.slug && updateData.slug !== product.slug) {
        const existingSlug = await Product.findOne({
          where: { slug: updateData.slug, id: { [Op.ne]: productId } }
        });
        if (existingSlug) {
          throw { statusCode: HTTP_STATUS.CONFLICT, message: 'Slug already exists' };
        }
      }

      // Update product
      await product.update(updateData);

      // Return updated product with category
      const updatedProduct = await this.getProductById(productId);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Product not found' };
      }

      // Soft delete by changing status to inactive
      await product.update({ status: PRODUCT_STATUS.INACTIVE });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async updateStock(productId, quantity) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { statusCode: HTTP_STATUS.NOT_FOUND, message: 'Product not found' };
      }

      const newStock = product.stock_quantity + quantity;
      if (newStock < 0) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: 'Insufficient stock' };
      }

      await product.update({ 
        stock_quantity: newStock,
        status: newStock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : PRODUCT_STATUS.ACTIVE
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getFeaturedProducts(limit = 8) {
    try {
      const products = await Product.findAll({
        where: {
          is_featured: true,
          status: PRODUCT_STATUS.ACTIVE,
          stock_quantity: { [Op.gt]: 0 }
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          }
        ],
        limit: parseInt(limit),
        order: [['created_at', 'DESC']]
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getProductStats() {
    try {
      const totalProducts = await Product.count();
      const activeProducts = await Product.count({ where: { status: PRODUCT_STATUS.ACTIVE } });
      const inactiveProducts = await Product.count({ where: { status: PRODUCT_STATUS.INACTIVE } });
      const outOfStockProducts = await Product.count({ where: { status: PRODUCT_STATUS.OUT_OF_STOCK } });
      const featuredProducts = await Product.count({ where: { is_featured: true } });
      const lowStockProducts = await Product.count({
        where: {
          stock_quantity: { [Op.lte]: Product.sequelize.col('min_stock_level') }
        }
      });

      return {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        out_of_stock: outOfStockProducts,
        featured: featuredProducts,
        low_stock: lowStockProducts
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;