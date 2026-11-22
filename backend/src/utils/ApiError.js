/**
 * An error that carries an HTTP status code and a machine-readable code.
 * Throw it from controllers or services; the central error handler turns it
 * into a consistent JSON response.
 */
export default class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code, for example 404.
   * @param {string} message - Safe, user-facing message.
   * @param {string} [code] - Short machine-readable code, for example NOT_FOUND.
   */
  constructor(statusCode, message, code = 'ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
