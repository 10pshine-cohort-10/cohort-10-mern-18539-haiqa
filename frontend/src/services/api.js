import axios from 'axios';
import { API_BASE_URL } from '../config/env';

/**
 * Shared Axios instance. Every service file uses it, so the base URL,
 * timeout and (from Week 2) credentials are configured in one place.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/**
 * Turns any Axios error into a short, readable message for the UI.
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond.';
  }
  if (error?.request && !error?.response) {
    return 'Cannot reach the server. Is the backend running?';
  }
  return 'Something went wrong. Please try again.';
}

export default api;
