import { buildHealthReport } from '../services/health.service.js';

/**
 * Creates the GET /api/health handler.
 * Responds 200 when the database is connected and 503 when it is not,
 * so monitoring tools and the frontend can tell the difference.
 *
 * @param {{ getDatabaseStatus: () => string, environment: string }} dependencies
 * @returns {import('express').RequestHandler}
 */
export function createHealthController(dependencies) {
  return function getHealth(req, res, next) {
    try {
      const { healthy, report } = buildHealthReport(dependencies);
      res.status(healthy ? 200 : 503).json({ success: healthy, data: report });
    } catch (error) {
      next(error);
    }
  };
}
