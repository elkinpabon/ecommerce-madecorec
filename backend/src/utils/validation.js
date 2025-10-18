const validator = require('validator');

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Basic international phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return validator.isURL(url);
};

const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return validator.escape(str.trim());
};

const validateSKU = (sku) => {
  if (!sku || typeof sku !== 'string') {
    return false;
  }
  
  // SKU should be alphanumeric with hyphens/underscores, 3-50 chars
  const skuRegex = /^[A-Za-z0-9_-]{3,50}$/;
  return skuRegex.test(sku);
};

const validateSlug = (slug) => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Slug should be lowercase alphanumeric with hyphens, 2-100 chars
  const slugRegex = /^[a-z0-9-]{2,100}$/;
  return slugRegex.test(slug);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateURL,
  sanitizeString,
  validateSKU,
  validateSlug
};