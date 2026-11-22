import { Router } from 'express';
import { createHealthController } from '../controllers/health.controller.js';

/**
 * @param {{ getDatabaseStatus: () => string, environment: string }} dependencies
 * @returns {import('express').Router}
 */
export default function createHealthRouter(dependencies) {
  const router = Router();
  router.get('/', createHealthController(dependencies));
  return router;
}
