import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Sidebar from '../components/common/Sidebar';
import { NAV_ITEMS } from '../components/common/navItems';

function renderSidebar(props = {}) {
  return render(
    <MemoryRouter>
      <Sidebar isOpen={false} onClose={jest.fn()} {...props} />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('lists every navigation item from the design', () => {
    renderSidebar();

    for (const item of NAV_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });

  it('marks Home as the active page', () => {
    renderSidebar();

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows future pages as disabled instead of broken links', () => {
    renderSidebar();

    expect(screen.queryByRole('link', { name: /All Notes/ })).not.toBeInTheDocument();
    expect(screen.getByText('All Notes').closest('[aria-disabled="true"]')).toHaveAttribute('title', 'Available in Week 3');
  });

  it('calls onClose when the close button is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderSidebar({ isOpen: true, onClose });

    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('AppLayout mobile menu', () => {
  it('opens and closes the sidebar with the menu buttons', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    );
    const menuButton = screen.getByRole('button', { name: 'Open menu' });

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: 'Close menu overlay' }));
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
