import config from './config/env.js';
import createApp from './app.js';
import { connectWithRetry, disconnectDatabase } from './config/database.js';
import logger from './utils/logger.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`API listening on http://localhost:${config.port} (${config.nodeEnv})`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.fatal(`Port ${config.port} is already in use. Stop the other process or change PORT in .env.`);
  } else {
    logger.fatal({ err: error }, 'HTTP server error');
  }
  process.exit(1);
});

// The API keeps running if MongoDB is down so /api/health can report the problem,
// and keeps retrying the connection until MongoDB is reachable.
const databaseConnection = connectWithRetry(config.mongodbUri, {
  onRetry: (attempt, delayMs) => {
    logger.warn(
      `MongoDB not reachable (attempt ${attempt}). Retrying in ${delayMs / 1000}s. Check that MongoDB is running and MONGODB_URI in backend/.env is correct.`,
    );
  },
});

/**
 * Stops retries, closes the HTTP server and the MongoDB connection, then exits.
 * @param {'SIGINT' | 'SIGTERM'} signal - The signal that triggered the shutdown.
 * @returns {void}
 */
function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  databaseConnection.cancel();
  server.close(async () => {
    try {
      await disconnectDatabase();
      logger.info('Shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, 'Error during shutdown');
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  process.exit(1);
});
