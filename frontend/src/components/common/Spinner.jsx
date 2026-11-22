import PropTypes from 'prop-types';

const SIZES = { sm: 'size-4 border-2', md: 'size-6 border-2', lg: 'size-10 border-[3px]' };

/** Accessible loading spinner. */
export default function Spinner({ size = 'md', label = 'Loading' }) {
  return (
    <span role="status" className="inline-flex items-center">
      <span
        aria-hidden="true"
        className={`animate-spin rounded-full border-current border-t-transparent ${SIZES[size]}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  label: PropTypes.string,
};
