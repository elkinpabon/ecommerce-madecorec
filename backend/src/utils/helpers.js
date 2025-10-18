const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/server');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORDER-${timestamp}-${random}`.toUpperCase();
};

const calculateTax = (subtotal, taxRate = 0.12) => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

const formatPrice = (price) => {
  return Math.round(price * 100) / 100;
};

const generateSKU = (productName, categoryId) => {
  const cleanName = productName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const namePrefix = cleanName.substring(0, 3);
  const timestamp = Date.now().toString().slice(-4);
  return `${namePrefix}${categoryId}${timestamp}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateOrderNumber,
  calculateTax,
  formatPrice,
  generateSKU
};