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
