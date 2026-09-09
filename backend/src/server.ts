import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/db';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDatabase();

    // Start Express HTTP Server
    const server = app.listen(config.port, () => {
      logger.info(`Farmer OS Backend Server running on http://localhost:${config.port}`);
      logger.info(`Health check available at http://localhost:${config.port}/api/health`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    // Handle graceful shutdown
    const handleShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });

      // Force shutdown if taking longer than 5 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 5000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal error starting Farmer OS backend server:', error);
    process.exit(1);
  }
};

startServer();
