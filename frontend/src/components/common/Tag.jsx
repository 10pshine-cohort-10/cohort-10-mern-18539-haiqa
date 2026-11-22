import PropTypes from 'prop-types';

const TONES = {
  work: 'bg-tag-work text-sage-800',
  personal: 'bg-tag-personal text-[#2f4a72]',
  learning: 'bg-tag-learning text-[#5a3d7a]',
  health: 'bg-tag-health text-[#7a5326]',
  neutral: 'bg-sage-100 text-ink-muted',
};

/** Small pill used for note tags and categories. */
export default function Tag({ label, tone = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone] || TONES.neutral}`}>
      {label}
    </span>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['work', 'personal', 'learning', 'health', 'neutral']),
};
