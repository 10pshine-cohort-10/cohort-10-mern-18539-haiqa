import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../components/common/Button';
import TextField from '../components/common/TextField';
import NoteCard from '../components/notes/NoteCard';
import DesignSystemPreview from '../components/dashboard/DesignSystemPreview';
import { formatShortDate, formatUptime } from '../utils/formatDate';
import { isValidEmail } from '../utils/validators';

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and busy while loading so it cannot be double-submitted', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} isLoading>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: /save/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('TextField', () => {
  it('links the label to the input', () => {
    render(<TextField label="Full name" />);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
  });

  it('announces the error and marks the input invalid', () => {
    render(<TextField label="Email address" error="Email address is required" />);
    const input = screen.getByLabelText('Email address');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email address is required');
    expect(screen.getByRole('alert')).toHaveTextContent('Email address is required');
  });
});

describe('NoteCard', () => {
  const props = {
    title: 'Project Ideas',
    preview: 'Key takeaways',
    date: '2025-04-24',
    tag: { label: 'work', tone: 'work' },
  };

  it('shows the title, preview, formatted date and tag', () => {
    render(<NoteCard {...props} onOpen={jest.fn()} onToggleFavorite={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Project Ideas' })).toBeInTheDocument();
    expect(screen.getByText('Key takeaways')).toBeInTheDocument();
    expect(screen.getByText('Apr 24, 2025')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('calls the right handler for opening and for the favorite star', async () => {
    const user = userEvent.setup();
    const onOpen = jest.fn();
    const onToggleFavorite = jest.fn();
    render(<NoteCard {...props} onOpen={onOpen} onToggleFavorite={onToggleFavorite} />);

    await user.click(screen.getByRole('button', { name: 'Add Project Ideas to favorites' }));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Project Ideas' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe('DesignSystemPreview', () => {
  it('validates the sample email field', async () => {
    const user = userEvent.setup();
    render(<DesignSystemPreview />);
    const validate = screen.getByRole('button', { name: 'Validate' });

    await user.click(validate);
    expect(screen.getByRole('alert')).toHaveTextContent('Email address is required');

    await user.type(screen.getByLabelText('Email address'), 'not-an-email');
    await user.click(validate);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address');

    await user.clear(screen.getByLabelText('Email address'));
    await user.type(screen.getByLabelText('Email address'), 'haiqa@example.com');
    await user.click(validate);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(/Looks good!/)).toBeInTheDocument();
  });

  it('gives feedback when a sample button or card is pressed', async () => {
    const user = userEvent.setup();
    render(<DesignSystemPreview />);

    await user.click(screen.getByRole('button', { name: 'Create Note' }));
    expect(screen.getByText(/In Week 3 it opens the note editor/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Book Notes' }));
    expect(screen.getByText('You opened "Book Notes". The note editor arrives in Week 3.')).toBeInTheDocument();
  });

  it('toggles a favorite star on and off', async () => {
    const user = userEvent.setup();
    render(<DesignSystemPreview />);
    const star = screen.getByRole('button', { name: 'Add Travel Plans to favorites' });

    expect(star).toHaveAttribute('aria-pressed', 'false');
    await user.click(star);
    expect(screen.getByRole('button', { name: 'Remove Travel Plans from favorites' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('utility functions', () => {
  it('formats dates like the design reference', () => {
    expect(formatShortDate('2025-04-12')).toBe('Apr 12, 2025');
    expect(formatShortDate('not a date')).toBe('');
  });

  it('formats uptime in a readable way', () => {
    expect(formatUptime(45)).toBe('45s');
    expect(formatUptime(125)).toBe('2m 5s');
    expect(formatUptime(7500)).toBe('2h 5m');
  });

  it('checks email format', () => {
    expect(isValidEmail('haiqa@example.com')).toBe(true);
    expect(isValidEmail('haiqa@example')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
