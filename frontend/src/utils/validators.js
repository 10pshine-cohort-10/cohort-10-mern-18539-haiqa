const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Basic email format check used by forms (the backend validates again).
 * @param {string} value
 * @returns {boolean}
 */
export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value).trim());
}
