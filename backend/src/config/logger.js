import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  transport: isDev ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
});

export default logger;
