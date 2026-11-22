import ApiError from '../utils/ApiError.js';

/**
 * Catches requests that matched no route and forwards a 404 error.
 * @type {import('express').RequestHandler}
 */
export default function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}
