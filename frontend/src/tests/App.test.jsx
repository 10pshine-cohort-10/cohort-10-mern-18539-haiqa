import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { fetchHealth } from '../services/healthService';

jest.mock('../services/healthService');

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  beforeEach(() => {
    fetchHealth.mockResolvedValue({
      status: 'ok',
      environment: 'development',
      uptimeSeconds: 12,
      timestamp: '2026-01-01T00:00:00.000Z',
      services: { api: 'up', database: 'connected' },
    });
  });

  afterEach(() => jest.resetAllMocks());

  it('shows the home page inside the app layout at "/"', async () => {
    renderAt('/');

    expect(screen.getByRole('heading', { level: 1, name: 'Leafnote' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(await screen.findByText(/Everything is running/)).toBeInTheDocument();
  });

  it('shows the 404 page for unknown URLs and links back home', async () => {
    const user = userEvent.setup();
    renderAt('/this/does/not/exist');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Back to home' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Leafnote' })).toBeInTheDocument();
    expect(await screen.findByText(/Everything is running/)).toBeInTheDocument();
  });
});
