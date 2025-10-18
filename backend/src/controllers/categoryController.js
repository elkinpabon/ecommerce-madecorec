const CategoryService = require('../services/categoryService');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

class CategoryController {
  static async getAllCategories(req, res, next) {
    try {
      const result = await CategoryService.getAllCategories(req.query);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, 'Categories retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getActiveCategories(req, res, next) {
    try {
      const categories = await CategoryService.getActiveCategories();
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(categories, 'Active categories retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(category, 'Category retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getCategoryBySlug(slug);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(category, 'Category retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.created(category, 'Category created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const updatedCategory = await CategoryService.updateCategory(id, req.body);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedCategory, 'Category updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(null, 'Category deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async toggleCategoryStatus(req, res, next) {
    try {
      const { id } = req.params;
      const updatedCategory = await CategoryService.toggleCategoryStatus(id);
      
      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(updatedCategory, 'Category status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;