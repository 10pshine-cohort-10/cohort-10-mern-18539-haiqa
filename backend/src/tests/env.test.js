import { expect } from 'chai';
import { buildConfig } from '../config/env.js';

const VALID_URI = 'mongodb://127.0.0.1:27017/leafnote';

describe('buildConfig (environment configuration)', () => {
  it('applies sensible defaults', () => {
    const config = buildConfig({ MONGODB_URI: VALID_URI });

    expect(config.nodeEnv).to.equal('development');
    expect(config.port).to.equal(5000);
    expect(config.clientUrls).to.deep.equal(['http://localhost:5173']);
    expect(config.isProduction).to.equal(false);
  });

  it('reads values from the environment object', () => {
    const config = buildConfig({
      NODE_ENV: 'production',
      PORT: '8080',
      MONGODB_URI: 'mongodb+srv://user:secret@cluster0.example.mongodb.net/notes',
      CLIENT_URL: 'https://notes.example.com, http://localhost:5173',
      LOG_LEVEL: 'warn',
    });

    expect(config.port).to.equal(8080);
    expect(config.isProduction).to.equal(true);
    expect(config.logLevel).to.equal('warn');
    expect(config.clientUrls).to.deep.equal(['https://notes.example.com', 'http://localhost:5173']);
  });

  it('requires MONGODB_URI outside the test environment', () => {
    expect(() => buildConfig({ NODE_ENV: 'development' })).to.throw(/MONGODB_URI is required/);
  });

  it('does not require MONGODB_URI in the test environment', () => {
    expect(() => buildConfig({ NODE_ENV: 'test' })).to.not.throw();
  });

  it('rejects a MONGODB_URI with the wrong scheme', () => {
    expect(() => buildConfig({ MONGODB_URI: 'mysql://localhost/notes' })).to.throw(/must start with mongodb/);
  });

  it('rejects an invalid PORT', () => {
    expect(() => buildConfig({ MONGODB_URI: VALID_URI, PORT: 'abc' })).to.throw(/PORT/);
    expect(() => buildConfig({ MONGODB_URI: VALID_URI, PORT: '70000' })).to.throw(/PORT/);
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(() => buildConfig({ NODE_ENV: 'staging', MONGODB_URI: VALID_URI })).to.throw(/NODE_ENV/);
  });
});
