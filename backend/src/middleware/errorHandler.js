import logger from '../utils/logger.js';

/**
 * Creates the central Express error handler.
 * Every error ends up here and is turned into the same JSON shape:
 *   { success: false, error: { code, message } }
 * Unexpected (500) errors never expose their internal message in production.
 *
 * @param {{ isProduction: boolean }} options
 * @returns {import('express').ErrorRequestHandler}
 */
export default function createErrorHandler({ isProduction }) {
  // Express recognises error handlers by their four parameters, so `next` must stay.
  // eslint-disable-next-line no-unused-vars
  return function errorHandler(error, req, res, next) {
    let statusCode = error.statusCode || error.status || 500;
    let code = error.code || 'INTERNAL_ERROR';
    let message = error.message || 'Something went wrong';

    if (error.type === 'entity.parse.failed') {
      statusCode = 400;
      code = 'INVALID_JSON';
      message = 'The request body is not valid JSON';
    } else if (error.type === 'entity.too.large') {
      statusCode = 413;
      code = 'PAYLOAD_TOO_LARGE';
      message = 'The request body is too large';
    }

    if (typeof code !== 'string') {
      code = 'ERROR';
    }

    if (statusCode >= 500) {
      logger.error({ err: error, method: req.method, url: req.originalUrl }, 'Unhandled server error');
      code = 'INTERNAL_ERROR';
      if (isProduction) {
        message = 'Something went wrong. Please try again later.';
      }
    } else {
      logger.warn({ statusCode, code, method: req.method, url: req.originalUrl }, message);
    }

    res.status(statusCode).json({ success: false, error: { code, message } });
  };
}
