/**
 * Builds the health report for the API.
 * The database status function is passed in so the service can be tested
 * without a real database.
 *
 * @param {{ getDatabaseStatus: () => string, environment: string }} options
 * @returns {{ healthy: boolean, report: object }}
 */
export function buildHealthReport({ getDatabaseStatus, environment }) {
  const databaseStatus = getDatabaseStatus();
  const healthy = databaseStatus === 'connected';

  return {
    healthy,
    report: {
      status: healthy ? 'ok' : 'degraded',
      environment,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      services: {
        api: 'up',
        database: databaseStatus,
      },
    },
  };
}
