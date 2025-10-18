module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // PayPhone Configuration
  payphone: {
    apiUrl: process.env.PAYPHONE_API_URL,
    clientId: process.env.PAYPHONE_CLIENT_ID,
    clientSecret: process.env.PAYPHONE_CLIENT_SECRET,
    storeId: process.env.PAYPHONE_STORE_ID
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  }
};