import logger from '../config/logger.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const safe = { status, name: err.name, type: err.type, method: req.method, path: req.path };
  if (status >= 500 && err.body === undefined) safe.stack = err.stack;
  logger.error(safe, 'Request failed');
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Something went wrong' : err.message,
  });
}
