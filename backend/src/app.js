import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env.js';
import { getDatabaseStatus as defaultGetDatabaseStatus } from './config/database.js';
import createApiRouter from './routes/index.js';
import requestLogger from './middleware/requestLogger.js';
import notFound from './middleware/notFound.js';
import createErrorHandler from './middleware/errorHandler.js';

/**
 * Builds the Express application without starting it.
 * server.js starts it; the tests import it directly with Supertest.
 *
 * @param {{
 *   getDatabaseStatus?: () => string,
 *   clientUrls?: string[],
 *   environment?: string,
 *   isProduction?: boolean
 * }} [options] - Overrides used by the tests.
 * @returns {import('express').Express}
 */
export default function createApp(options = {}) {
  const {
    getDatabaseStatus = defaultGetDatabaseStatus,
    clientUrls = config.clientUrls,
    environment = config.nodeEnv,
    isProduction = config.isProduction,
  } = options;

  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        // Requests with no Origin header (curl, Postman, server-to-server) are allowed.
        if (!origin || clientUrls.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  app.use(requestLogger);

  app.get('/', (req, res) => {
    res.json({
      success: true,
      data: { name: 'Leafnote API', version: '1.0.0', health: '/api/health' },
    });
  });

  app.use('/api', createApiRouter({ getDatabaseStatus, environment }));

  app.use(notFound);
  app.use(createErrorHandler({ isProduction }));

  return app;
}
