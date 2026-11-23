import 'dotenv/config';
import createApp from './app.js';
import logger from './config/logger.js';
import { connectDB, disconnectDB } from './config/db.js';

const port = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (err) {
    logger.error(err, 'Could not connect to MongoDB');
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(port, () => {
    logger.info(`API listening on http://localhost:${port}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();
