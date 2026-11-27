import mongoose from 'mongoose';
import logger from './logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ name: err.name }, 'MongoDB connection failed');
    throw err;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (err) {
    logger.error({ name: err.name }, 'MongoDB disconnect failed');
    throw err;
  }
}
