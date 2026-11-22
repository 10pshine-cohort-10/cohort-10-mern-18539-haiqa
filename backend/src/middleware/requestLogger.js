import pinoHttp from 'pino-http';
import logger from '../utils/logger.js';

/**
 * Logs every HTTP request and its response (method, URL, status, duration).
 * Health checks are logged at debug level so they do not flood the logs.
 */
const requestLogger = pinoHttp({
  logger,
  customLogLevel(req, res, error) {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (req.url.startsWith('/api/health')) return 'debug';
    return 'info';
  },
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});

export default requestLogger;
