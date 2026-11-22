import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const DEFAULT_PORT = 5000;
const VALID_ENVIRONMENTS = ['development', 'test', 'production'];

/**
 * Builds and validates the application configuration from an environment object.
 * Kept as a pure function so it can be unit tested without touching process.env.
 *
 * @param {Record<string, string | undefined>} source - Usually process.env.
 * @returns {{
 *   nodeEnv: string,
 *   port: number,
 *   mongodbUri: string,
 *   clientUrls: string[],
 *   logLevel: string,
 *   isProduction: boolean,
 *   isTest: boolean
 * }}
 */
export function buildConfig(source) {
  const nodeEnv = source.NODE_ENV || 'development';
  if (!VALID_ENVIRONMENTS.includes(nodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${VALID_ENVIRONMENTS.join(', ')}`);
  }

  const port = Number(source.PORT || DEFAULT_PORT);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a whole number between 1 and 65535');
  }

  const mongodbUri = source.MONGODB_URI || '';
  if (nodeEnv !== 'test' && !mongodbUri) {
    throw new Error('MONGODB_URI is required. Copy .env.example to .env and set it.');
  }
  if (mongodbUri && !/^mongodb(\+srv)?:\/\//.test(mongodbUri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }

  const clientUrls = (source.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    nodeEnv,
    port,
    mongodbUri,
    clientUrls,
    logLevel: source.LOG_LEVEL || (nodeEnv === 'test' ? 'silent' : 'info'),
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
  };
}

const config = buildConfig(process.env);

export default config;
