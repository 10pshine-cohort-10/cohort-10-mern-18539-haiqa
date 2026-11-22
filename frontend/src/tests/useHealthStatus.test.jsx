import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useHealthStatus from '../hooks/useHealthStatus';
import { fetchHealth } from '../services/healthService';

jest.mock('../services/healthService');

function HealthProbe() {
  const { health, isLoading, error, refresh } = useHealthStatus();
  return (
    <div>
      <p>loading: {String(isLoading)}</p>
      <p>database: {health?.services.database ?? 'none'}</p>
      <p>error: {error || 'none'}</p>
      <button type="button" onClick={refresh}>
        refresh
      </button>
    </div>
  );
}

describe('useHealthStatus', () => {
  afterEach(() => jest.resetAllMocks());

  it('loads the health report when the component mounts', async () => {
    fetchHealth.mockResolvedValue({ status: 'ok', services: { api: 'up', database: 'connected' } });

    render(<HealthProbe />);

    expect(screen.getByText('loading: true')).toBeInTheDocument();
    expect(await screen.findByText('database: connected')).toBeInTheDocument();
    expect(screen.getByText('loading: false')).toBeInTheDocument();
    expect(fetchHealth).toHaveBeenCalledTimes(1);
  });

  it('turns a network failure into a readable error message', async () => {
    fetchHealth.mockRejectedValue({ request: {}, message: 'Network Error' });

    render(<HealthProbe />);

    expect(await screen.findByText('error: Cannot reach the server. Is the backend running?')).toBeInTheDocument();
    expect(screen.getByText('database: none')).toBeInTheDocument();
  });

  it('clears the error after a successful retry', async () => {
    const user = userEvent.setup();
    fetchHealth
      .mockRejectedValueOnce({ request: {}, message: 'Network Error' })
      .mockResolvedValueOnce({ status: 'ok', services: { api: 'up', database: 'connected' } });

    render(<HealthProbe />);
    await screen.findByText(/Cannot reach the server/);

    await user.click(screen.getByRole('button', { name: 'refresh' }));

    expect(await screen.findByText('database: connected')).toBeInTheDocument();
    expect(screen.getByText('error: none')).toBeInTheDocument();
    expect(fetchHealth).toHaveBeenCalledTimes(2);
  });
});
