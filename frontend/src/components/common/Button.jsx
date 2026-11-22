import PropTypes from 'prop-types';
import Spinner from './Spinner';

const VARIANT_CLASSES = {
  primary: 'bg-sage-600 text-white hover:bg-sage-700 shadow-sm',
  secondary: 'bg-paper text-ink border border-line hover:bg-sage-50 hover:border-sage-200',
  ghost: 'bg-transparent text-ink hover:bg-sage-100',
  danger: 'bg-danger text-white hover:brightness-95 shadow-sm',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

/**
 * The one button component used across the app.
 * Shows a spinner and blocks clicks while `isLoading` is true.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  onClick = undefined,
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" label="Loading" /> : Icon && <Icon aria-hidden="true" className="size-4" />}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
