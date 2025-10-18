require('dotenv').config();
const path = require('path');

// Validate environment variables
if (!process.env.DB_USER) {
  console.log('⚠️  DB_USER not set, using default: root');
}

console.log('🚀 Starting server...');

const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    console.log('Database connected successfully');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║   SERVER RUNNING SUCCESSFULLY          ║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║  Port:        ${PORT}`.padEnd(41) + '║');
      console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}`.padEnd(41) + '║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║  API:    http://localhost:${PORT}/api`.padEnd(41) + '║');
      console.log(`║  Health: http://localhost:${PORT}/health`.padEnd(41) + '║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
    });

    // Handle errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(` Port ${PORT} is already in use`);
      } else {
        console.error(' Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down...');
      server.close(() => {
        console.log(' Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down...');
      server.close(() => {
        console.log(' Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error(' Failed to start server:');
    console.error(error);
    process.exit(1);
  }
}

// Start the server
startServer();