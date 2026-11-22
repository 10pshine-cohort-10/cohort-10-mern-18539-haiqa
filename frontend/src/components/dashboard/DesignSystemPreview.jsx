import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import TextField from '../common/TextField';
import Tag from '../common/Tag';
import NoteCard from '../notes/NoteCard';
import { isValidEmail } from '../../utils/validators';

const SAMPLE_CARDS = [
  { id: 'ideas', title: 'Project Ideas', preview: 'Key takeaways from the next big project...', date: '2025-04-24', tag: { label: 'work', tone: 'work' } },
  { id: 'travel', title: 'Travel Plans', preview: 'Places to visit, things to see and do...', date: '2025-04-12', tag: { label: 'personal', tone: 'personal' } },
  { id: 'books', title: 'Book Notes', preview: 'Key takeaways from the books I read this month.', date: '2025-04-18', tag: { label: 'learning', tone: 'learning' } },
];

/**
 * Week 1 only: shows the shared components (buttons, inputs, tags, note cards)
 * so the design system can be reviewed. Week 3 replaces it with the user's real notes.
 */
export default function DesignSystemPreview() {
  const [favorites, setFavorites] = useState(['ideas']);
  const [previewMessage, setPreviewMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  function toggleFavorite(id) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function handleValidate(event) {
    event.preventDefault();
    setEmailMessage('');
    if (!email.trim()) {
      setEmailError('Email address is required');
    } else if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address, for example name@example.com');
    } else {
      setEmailError('');
      setEmailMessage('Looks good! The same validation will power the sign-up form in Week 2.');
    }
  }

  return (
    <Card as="section" aria-labelledby="design-system-title" className="p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="design-system-title" className="text-lg font-semibold text-ink">
          Design system preview
        </h2>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Sample content, replaced by your notes in Week 3</p>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm font-medium text-sage-700">
        {previewMessage}
      </p>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-muted">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button icon={Plus} onClick={() => setPreviewMessage('"Create Note" pressed. In Week 3 it opens the note editor.')}>
                Create Note
              </Button>
              <Button variant="secondary" onClick={() => setPreviewMessage('"Cancel" pressed. In Week 3 it closes the editor without saving.')}>
                Cancel
              </Button>
              <Button variant="ghost" icon={Search} onClick={() => setPreviewMessage('"Search" pressed. Note search arrives in Week 4.')}>
                Search
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-muted">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Tag label="work" tone="work" />
              <Tag label="personal" tone="personal" />
              <Tag label="learning" tone="learning" />
              <Tag label="health" tone="health" />
            </div>
          </div>
          <form noValidate onSubmit={handleValidate} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-ink-muted">Form field with validation</h3>
            <TextField
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={emailError}
              hint="Try an invalid email to see the error state."
            />
            <Button type="submit" variant="secondary" className="self-start">
              Validate
            </Button>
            {emailMessage && (
              <p role="status" className="text-sm font-medium text-sage-700">
                {emailMessage}
              </p>
            )}
          </form>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink-muted">Note cards</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {SAMPLE_CARDS.map((card) => (
              <NoteCard
                key={card.id}
                title={card.title}
                preview={card.preview}
                date={card.date}
                tag={card.tag}
                isFavorite={favorites.includes(card.id)}
                onToggleFavorite={() => toggleFavorite(card.id)}
                onOpen={() => setPreviewMessage(`You opened "${card.title}". The note editor arrives in Week 3.`)}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
