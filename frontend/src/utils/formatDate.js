/**
 * Formats an ISO date as "Apr 24, 2025", matching the design reference.
 * Returns an empty string for missing or invalid dates.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatShortDate(isoDate) {
  const date = new Date(isoDate);
  if (!isoDate || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Formats a number of seconds as "2h 5m" or "45s".
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatUptime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
