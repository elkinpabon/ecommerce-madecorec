const ProductService = require('../services/productService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const result = await ProductService.getAllProducts(req.query);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Products retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(product, 'Product retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(product, 'Product retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.created(product, 'Product created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.updateProduct(id, req.body);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedProduct, 'Product updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Product deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const updatedProduct = await ProductService.updateStock(id, quantity);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedProduct, 'Product stock updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedProducts(req, res, next) {
    try {
      const { limit } = req.query;
      const products = await ProductService.getFeaturedProducts(limit);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(products, 'Featured products retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductStats(req, res, next) {
    try {
      const stats = await ProductService.getProductStats();
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(stats, 'Product statistics retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async searchProducts(req, res, next) {
    try {
      const { q: search, ...otherParams } = req.query;
      const result = await ProductService.getAllProducts({ search, ...otherParams });
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Product search completed successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;