/**
 * Values read from Vite environment variables (frontend/.env).
 * Only variables starting with VITE_ are exposed to the browser, so never
 * put secrets here. Jest replaces this file with src/tests/mocks/env.js.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
