import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Converts a Mongoose readyState number into a readable word.
 * @param {number} readyState
 * @returns {string}
 */
export function describeReadyState(readyState) {
  return READY_STATES[readyState] || 'unknown';
}

/**
 * Returns the current MongoDB connection status as a word.
 * @returns {string}
 */
export function getDatabaseStatus() {
  return describeReadyState(mongoose.connection.readyState);
}

let listenersAttached = false;

function attachConnectionListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
  mongoose.connection.on('error', (error) => logger.error({ err: error }, 'MongoDB connection error'));
}

/**
 * Opens the MongoDB connection.
 * @param {string} uri - MongoDB connection string.
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('A MongoDB connection string is required');
  }
  attachConnectionListeners();
  try {
    return await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch (error) {
    logger.error({ err: error }, 'Could not connect to MongoDB');
    throw error;
  }
}

/**
 * Delay before retry number `attempt` (1, 2, 3, ...): 2s, 4s, 8s, 16s, then 30s at most.
 * @param {number} attempt
 * @returns {number} milliseconds
 */
export function retryDelay(attempt) {
  return Math.min(2000 * 2 ** (attempt - 1), 30000);
}

/**
 * Connects to MongoDB and keeps retrying with a growing delay if the first attempts fail.
 * Mongoose does not reconnect by itself after a failed first connection, so this covers
 * the case where MongoDB is down when the API starts.
 * @param {string} uri - MongoDB connection string.
 * @param {object} [options]
 * @param {(uri: string) => Promise<unknown>} [options.connect] - Connect function (replaced in tests).
 * @param {(attempt: number, delayMs: number) => void} [options.onRetry] - Called before each wait.
 * @param {number} [options.baseDelayMs] - First delay; later delays double up to 15x this value.
 * @returns {{ done: Promise<boolean>, cancel: () => void }} `done` resolves to true once connected,
 *   or false if `cancel()` was called first.
 */
export function connectWithRetry(uri, { connect = connectDatabase, onRetry = () => {}, baseDelayMs = 2000 } = {}) {
  let cancelled = false;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;
  /** @type {((value?: unknown) => void) | null} */
  let wake = null;

  /**
   * @param {number} ms
   * @returns {Promise<unknown>}
   */
  const wait = (ms) =>
    new Promise((resolve) => {
      wake = resolve;
      timer = setTimeout(resolve, ms);
    });

  const done = (async () => {
    for (let attempt = 1; !cancelled; attempt += 1) {
      try {
        await connect(uri);
        return !cancelled;
      } catch {
        if (cancelled) break;
        const delayMs = (retryDelay(attempt) / 2000) * baseDelayMs;
        onRetry(attempt, delayMs);
        if (!cancelled) await wait(delayMs);
      }
    }
    return false;
  })();

  return {
    done,
    cancel() {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (wake) wake();
    },
  };
}

/**
 * Closes the MongoDB connection if it is open.
 * @returns {Promise<void>}
 */
export async function disconnectDatabase() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.error({ err: error }, 'Error while closing the MongoDB connection');
    throw error;
  }
}
