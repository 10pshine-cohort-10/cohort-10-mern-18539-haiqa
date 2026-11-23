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
  const server = app.listen(port, (err) => {
    if (err) {
      logger.error(err, 'Could not start the server');
      disconnectDB().finally(() => process.exit(1));
      return;
    }
    logger.info(`API listening on http://localhost:${port}`);
  });

  const shutdown = () => {
      server.close(async () => {
      try {
        await disconnectDB();
        process.exit(0);
      } catch (err) {
        logger.error(err, 'Error while shutting down');
        process.exit(1);
      }
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();
