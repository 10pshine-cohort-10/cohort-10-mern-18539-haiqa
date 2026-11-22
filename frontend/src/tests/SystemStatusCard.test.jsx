import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';

const healthyReport = {
  status: 'ok',
  environment: 'development',
  uptimeSeconds: 3725,
  services: { api: 'up', database: 'connected' },
};

describe('SystemStatusCard', () => {
  it('shows a loading message while the first check runs', () => {
    render(<SystemStatusCard health={null} isLoading error="" onRefresh={jest.fn()} />);

    expect(screen.getByText('Checking system status...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check again/i })).toBeDisabled();
  });

  it('shows both services as online and the uptime when healthy', () => {
    render(<SystemStatusCard health={healthyReport} isLoading={false} error="" onRefresh={jest.fn()} />);

    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText(/uptime 1h 2m/)).toBeInTheDocument();
  });

  it('explains how to fix a disconnected database', () => {
    const degraded = { ...healthyReport, status: 'degraded', services: { api: 'up', database: 'disconnected' } };
    render(<SystemStatusCard health={degraded} isLoading={false} error="" onRefresh={jest.fn()} />);

    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByText(/cannot reach MongoDB/)).toBeInTheDocument();
  });

  it('shows the error and lets the user retry', async () => {
    const user = userEvent.setup();
    const onRefresh = jest.fn();
    render(
      <SystemStatusCard
        health={null}
        isLoading={false}
        error="Cannot reach the server. Is the backend running?"
        onRefresh={onRefresh}
      />,
    );

    expect(screen.getByText(/Cannot reach the server/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /check again/i }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
