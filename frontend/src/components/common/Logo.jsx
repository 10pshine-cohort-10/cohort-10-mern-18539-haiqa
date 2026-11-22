import PropTypes from 'prop-types';

/** Leafnote mark: a note page with a folded corner and a leaf on it. */
function LeafnoteMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M6 3h8.5L19 7.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
      <path d="M9 17c0-4 2.5-6.5 6-7-.3 3.8-2.6 6.5-6 7z" />
      <path d="M9 17l3.2-3.4" />
    </svg>
  );
}

LeafnoteMark.propTypes = {
  className: PropTypes.string,
};

/** Leafnote logo: leaf-and-page badge plus the app name. */
export default function Logo({ tone = 'dark', showName = true }) {
  const isLight = tone === 'light';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid size-9 place-items-center rounded-full ${isLight ? 'bg-white/15 text-white' : 'bg-sage-100 text-sage-700'}`}
      >
        <LeafnoteMark className="size-5" />
      </span>
      {showName && (
        <span className={`text-[15px] font-bold tracking-tight ${isLight ? 'text-white' : 'text-ink'}`}>
          Leafnote
        </span>
      )}
    </span>
  );
}

Logo.propTypes = {
  tone: PropTypes.oneOf(['dark', 'light']),
  showName: PropTypes.bool,
};
