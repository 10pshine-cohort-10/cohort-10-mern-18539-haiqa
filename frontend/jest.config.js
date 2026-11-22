/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/**/*.test.{js,jsx}'],
  setupFiles: ['<rootDir>/src/tests/polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
  moduleNameMapper: {
    // import.meta.env only exists in Vite, so tests use a fixed config file.
    '^(\\.{1,2}/)+config/env$': '<rootDir>/src/tests/mocks/env.js',
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg|webp)$': '<rootDir>/src/tests/mocks/fileMock.js',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/tests/**', '!src/config/env.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
