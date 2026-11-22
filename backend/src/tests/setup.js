// Loaded by Mocha before any test file (see .mocharc.json).
// Forces the test environment so the logger is silent and no real
// database connection string is required. Works on Windows and macOS/Linux.
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
