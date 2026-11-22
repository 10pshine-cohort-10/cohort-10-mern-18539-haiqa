import api from './api';

/**
 * Calls GET /api/health.
 * The API answers 503 when MongoDB is down; that is still a valid report,
 * so both 200 and 503 resolve and only network or other errors reject.
 *
 * @returns {Promise<{
 *   status: string,
 *   environment: string,
 *   uptimeSeconds: number,
 *   timestamp: string,
 *   services: { api: string, database: string }
 * }>}
 */
export async function fetchHealth() {
  const response = await api.get('/health', {
    validateStatus: (status) => status === 200 || status === 503,
  });
  return response.data.data;
}
