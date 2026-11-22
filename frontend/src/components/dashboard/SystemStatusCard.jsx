import PropTypes from 'prop-types';
import { Activity, AlertTriangle, Database, RefreshCw, Server } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import StatusBadge from '../common/StatusBadge';
import { formatUptime } from '../../utils/formatDate';

function StatusRow({ icon: Icon, label, status }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-line bg-white/70 px-4 py-3">
      <span className="flex items-center gap-3 text-sm font-medium text-ink">
        <Icon aria-hidden="true" className="size-4 text-sage-600" />
        {label}
      </span>
      <StatusBadge status={status} />
    </li>
  );
}

StatusRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

/**
 * Shows whether the React app can reach the API and whether the API can reach MongoDB.
 * Receives its data from the useHealthStatus hook (see HomePage).
 */
export default function SystemStatusCard({ health, isLoading, error, onRefresh }) {
  const isHealthy = health?.status === 'ok';

  return (
    <Card as="section" aria-labelledby="system-status-title" className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-sage-100 text-sage-700">
            <Activity aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id="system-status-title" className="text-lg font-semibold text-ink">
              System status
            </h2>
            <p className="text-sm text-ink-muted">Live check of the API and the MongoDB connection.</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} isLoading={isLoading} onClick={onRefresh}>
          Check again
        </Button>
      </div>

      <div className="mt-5" aria-live="polite">
        {isLoading && !health && !error && (
          <div className="flex items-center gap-3 py-6 text-sm text-ink-muted">
            <Spinner label="Checking system status" />
            Checking system status...
          </div>
        )}

        {error && !isLoading && (
          <div className="flex items-start gap-3 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-0.5 text-danger/80">
                Start it with <code className="rounded bg-white/60 px-1">npm run dev</code> in the backend folder.
              </p>
            </div>
          </div>
        )}

        {health && (
          <>
            <ul className="grid gap-3 sm:grid-cols-2">
              <StatusRow icon={Server} label="API server" status={health.services.api} />
              <StatusRow icon={Database} label="MongoDB" status={health.services.database} />
            </ul>
            <p className="mt-4 text-sm text-ink-muted">
              {isHealthy
                ? `Everything is running. Environment: ${health.environment}, uptime ${formatUptime(health.uptimeSeconds)}.`
                : 'The API is running but cannot reach MongoDB. Check that MongoDB is started and MONGODB_URI in backend/.env is correct.'}
            </p>
          </>
        )}
      </div>
    </Card>
  );
}

SystemStatusCard.propTypes = {
  health: PropTypes.shape({
    status: PropTypes.string.isRequired,
    environment: PropTypes.string,
    uptimeSeconds: PropTypes.number,
    services: PropTypes.shape({
      api: PropTypes.string.isRequired,
      database: PropTypes.string.isRequired,
    }).isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
