import { useId } from 'react';
import PropTypes from 'prop-types';

/**
 * Labelled text input with optional hint and error message.
 * The label, hint and error are linked to the input for screen readers.
 */
export default function TextField({ label, error = '', hint = '', type = 'text', className = '', ...inputProps }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`h-11 rounded-lg border bg-sage-50/60 px-3.5 text-sm text-ink placeholder:text-ink-muted/70 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-300 ${error ? 'border-danger' : 'border-line focus:border-sage-500'}`}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};
