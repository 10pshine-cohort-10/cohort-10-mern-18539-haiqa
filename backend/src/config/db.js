import mongoose from 'mongoose';
import logger from './logger.js';

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env');
  }
  await mongoose.connect(uri);
  logger.info('MongoDB connected');
}

export async function disconnectDB() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
