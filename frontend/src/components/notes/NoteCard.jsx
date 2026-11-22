import PropTypes from 'prop-types';
import { Star } from 'lucide-react';
import Tag from '../common/Tag';
import { formatShortDate } from '../../utils/formatDate';

/**
 * Note preview card, styled like the cards in the design reference.
 * Week 1 uses it in the design-system preview; Week 3 fills it with real notes
 * and wires up `onToggleFavorite` and `onOpen`.
 */
export default function NoteCard({ title, preview, date, tag = null, isFavorite = false, onOpen, onToggleFavorite }) {
  return (
    <article className="group relative flex min-h-36 flex-col rounded-xl border border-line bg-paper p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ink">
          <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 focus:outline-none">
            {title}
          </button>
        </h3>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          className="relative z-10 rounded-md p-1 text-ink-muted transition-colors hover:bg-sage-100 hover:text-ink"
        >
          <Star aria-hidden="true" className={`size-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{preview}</p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-ink-muted">
        <time dateTime={date}>{formatShortDate(date)}</time>
        {tag && <Tag label={tag.label} tone={tag.tone} />}
      </div>
    </article>
  );
}

NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  tag: PropTypes.shape({
    label: PropTypes.string.isRequired,
    tone: PropTypes.oneOf(['work', 'personal', 'learning', 'health', 'neutral']),
  }),
  isFavorite: PropTypes.bool,
  onOpen: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};
