import 'dotenv/config';
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const { default: createApp } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');

const app = createApp();
const validUser = { name: 'Test User', email: 'test@example.com', password: 'secret123' };

async function registerUser(data = validUser) {
  return request(app).post('/api/auth/register').send(data);
}

function dbName(uri) {
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^/?]*)/);
  return match ? match[1] : '';
}

describe('Auth API', () => {
  before(async () => {
    const uri = process.env.MONGODB_TEST_URI;
    if (!uri) {
      throw new Error('MONGODB_TEST_URI is missing. Add a separate test database to backend/.env');
    }

    const testDb = dbName(uri);
    if (!testDb || testDb === dbName(process.env.MONGODB_URI || '')) {
      throw new Error('MONGODB_TEST_URI must use a different database name than MONGODB_URI, because tests delete data');
    }
    if (!testDb.includes('test')) {
      throw new Error('The test database name must contain "test", for example leafnote-test');
    }

    await mongoose.connect(uri);
    await User.init();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('creates a user and returns a token', async () => {
      const res = await registerUser();

      expect(res.status).to.equal(201);
      expect(res.body.token).to.be.a('string');
      expect(res.body.user.email).to.equal(validUser.email);
      expect(res.body.user).to.not.have.property('password');
    });

    it('saves a hashed password, not the real one', async () => {
      await registerUser();
      const saved = await User.findOne({ email: validUser.email }).select('+password');

      expect(saved.password).to.not.equal(validUser.password);
      expect(await saved.comparePassword(validUser.password)).to.equal(true);
    });

    it('rejects an email that is already registered', async () => {
      await registerUser();
      const res = await registerUser({ ...validUser, email: 'TEST@example.com' });

      expect(res.status).to.equal(409);
    });

    it('rejects missing or invalid fields', async () => {
      const res = await registerUser({ name: '', email: 'not-an-email', password: '123' });

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.length(3);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await registerUser();
    });

    it('logs in with the right email and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).to.equal(200);
      expect(res.body.token).to.be.a('string');
    });

    it('rejects a wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrong-password' });

      expect(res.status).to.equal(401);
    });

    it('rejects an email that does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'secret123' });

      expect(res.status).to.equal(401);
    });

    it('rejects an empty body', async () => {
      const res = await request(app).post('/api/auth/login').send({});

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the logged-in user', async () => {
      const { body } = await registerUser();
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${body.token}`);

      expect(res.status).to.equal(200);
      expect(res.body.user.email).to.equal(validUser.email);
    });

    it('rejects a request without a token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).to.equal(401);
    });

    it('rejects a fake token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer not-a-real-token');

      expect(res.status).to.equal(401);
    });

    it('rejects a token for a user that was deleted', async () => {
      const { body } = await registerUser();
      await User.deleteMany({});
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${body.token}`);

      expect(res.status).to.equal(401);
    });
  });
});
