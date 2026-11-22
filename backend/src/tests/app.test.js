import { expect } from 'chai';
import request from 'supertest';
import createApp from '../app.js';

const ALLOWED_ORIGIN = 'http://localhost:5173';

function buildTestApp() {
  return createApp({ getDatabaseStatus: () => 'connected', clientUrls: [ALLOWED_ORIGIN] });
}

describe('Express application', () => {
  it('describes the API on GET /', async () => {
    const response = await request(buildTestApp()).get('/');

    expect(response.status).to.equal(200);
    expect(response.body.data).to.include({ name: 'Leafnote API', health: '/api/health' });
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(buildTestApp()).get('/api/does-not-exist');

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Route not found: GET /api/does-not-exist' },
    });
  });

  it('returns a JSON 400 when the request body is malformed JSON', async () => {
    const response = await request(buildTestApp())
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"title": ');

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal('INVALID_JSON');
  });

  it('sets security headers and hides the X-Powered-By header', async () => {
    const response = await request(buildTestApp()).get('/api/health');

    expect(response.headers).to.have.property('x-content-type-options', 'nosniff');
    expect(response.headers).to.not.have.property('x-powered-by');
  });

  it('allows CORS requests from the configured frontend origin', async () => {
    const response = await request(buildTestApp()).get('/api/health').set('Origin', ALLOWED_ORIGIN);

    expect(response.headers['access-control-allow-origin']).to.equal(ALLOWED_ORIGIN);
    expect(response.headers['access-control-allow-credentials']).to.equal('true');
  });

  it('does not grant CORS access to other origins', async () => {
    const response = await request(buildTestApp())
      .get('/api/health')
      .set('Origin', 'http://evil.example.com');

    expect(response.headers).to.not.have.property('access-control-allow-origin');
  });
});
