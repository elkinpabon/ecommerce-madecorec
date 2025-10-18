const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('📡 Initializing database connection...');
console.log('Database config:', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ecommerce_madecorec',
  user: process.env.DB_USER || 'root'
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_madecorec',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    await sequelize.sync({ alter: false });
    console.log('Models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDatabase
};