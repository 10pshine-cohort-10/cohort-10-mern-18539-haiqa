import { Router } from 'express';
import createHealthRouter from './health.routes.js';

/**
 * Mounts every API route under /api.
 * Week 2 adds /auth, Week 3 adds /notes and /users.
 *
 * @param {{ getDatabaseStatus: () => string, environment: string }} dependencies
 * @returns {import('express').Router}
 */
export default function createApiRouter(dependencies) {
  const router = Router();
  router.use('/health', createHealthRouter(dependencies));
  return router;
}
