import { expect } from 'chai';
import request from 'supertest';
import createApp from '../app.js';

describe('GET /api/health', () => {
  it('returns 200 and status "ok" when the database is connected', async () => {
    const app = createApp({ getDatabaseStatus: () => 'connected' });

    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.match(/application\/json/);
    expect(response.body.success).to.equal(true);
    expect(response.body.data.status).to.equal('ok');
    expect(response.body.data.services).to.deep.equal({ api: 'up', database: 'connected' });
  });

  it('returns 503 and status "degraded" when the database is disconnected', async () => {
    const app = createApp({ getDatabaseStatus: () => 'disconnected' });

    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(503);
    expect(response.body.success).to.equal(false);
    expect(response.body.data.status).to.equal('degraded');
    expect(response.body.data.services.database).to.equal('disconnected');
  });

  it('includes the environment, uptime and an ISO timestamp', async () => {
    const app = createApp({ getDatabaseStatus: () => 'connected', environment: 'test' });

    const { body } = await request(app).get('/api/health');

    expect(body.data.environment).to.equal('test');
    expect(body.data.uptimeSeconds).to.be.a('number').and.to.be.at.least(0);
    expect(new Date(body.data.timestamp).toISOString()).to.equal(body.data.timestamp);
  });

  it('passes unexpected failures to the central error handler', async () => {
    const app = createApp({
      getDatabaseStatus: () => {
        throw new Error('driver exploded');
      },
      isProduction: true,
    });

    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' },
    });
  });
});
