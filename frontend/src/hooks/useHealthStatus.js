import { useCallback, useEffect, useState } from 'react';
import { fetchHealth } from '../services/healthService';
import { getErrorMessage } from '../services/api';

/**
 * Loads the API health report and exposes a refresh function.
 * Every call to `refresh` bumps `requestId`, which re-runs the effect.
 *
 * @returns {{ health: object | null, isLoading: boolean, error: string, refresh: () => void }}
 */
export default function useHealthStatus() {
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    // Ignore a late answer if the component unmounted or a newer request started.
    let isActive = true;

    fetchHealth()
      .then((report) => {
        if (!isActive) return;
        setHealth(report);
        setError('');
      })
      .catch((requestError) => {
        if (!isActive) return;
        setHealth(null);
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [requestId]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError('');
    setRequestId((current) => current + 1);
  }, []);

  return { health, isLoading, error, refresh };
}
