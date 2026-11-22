import pino from 'pino';
import config from '../config/env.js';

/**
 * Shared Pino logger.
 * - development: human-readable coloured output (pino-pretty)
 * - production: structured JSON, one object per line
 * - test: silent, so test output stays clean
 * Sensitive fields are redacted so they never reach the logs.
 */
const logger = pino({
  level: config.logLevel,
  base: { service: 'leafnote-api' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
  ...(config.nodeEnv === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname,service' },
        },
      }
    : {}),
});

export default logger;
