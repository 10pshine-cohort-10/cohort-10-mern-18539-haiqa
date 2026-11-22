import PropTypes from 'prop-types';

/** White rounded container with the shared card shadow. */
export default function Card({ children, as: Component = 'div', className = '', ...rest }) {
  return (
    <Component className={`rounded-[var(--radius-card)] border border-line bg-paper shadow-card ${className}`} {...rest}>
      {children}
    </Component>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  className: PropTypes.string,
};
