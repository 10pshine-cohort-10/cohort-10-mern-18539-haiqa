import PropTypes from 'prop-types';

const STATUS_STYLES = {
  connected: { dot: 'bg-sage-600', pill: 'bg-sage-100 text-sage-800', text: 'Connected' },
  up: { dot: 'bg-sage-600', pill: 'bg-sage-100 text-sage-800', text: 'Online' },
  connecting: { dot: 'bg-warning', pill: 'bg-warning-soft text-warning', text: 'Connecting' },
  disconnecting: { dot: 'bg-warning', pill: 'bg-warning-soft text-warning', text: 'Disconnecting' },
  disconnected: { dot: 'bg-danger', pill: 'bg-danger-soft text-danger', text: 'Disconnected' },
  unreachable: { dot: 'bg-danger', pill: 'bg-danger-soft text-danger', text: 'Unreachable' },
};

const UNKNOWN = { dot: 'bg-ink-muted', pill: 'bg-sage-100 text-ink-muted', text: 'Unknown' };

/** Coloured pill that shows the state of a service. */
export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || UNKNOWN;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.pill}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${style.dot}`} />
      {style.text}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};
