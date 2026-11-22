import { expect } from 'chai';
import createErrorHandler from '../middleware/errorHandler.js';
import ApiError from '../utils/ApiError.js';

function createMockResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

const fakeRequest = { method: 'GET', originalUrl: '/api/test' };

describe('central error handler', () => {
  it('uses the status, code and message of an ApiError', () => {
    const res = createMockResponse();
    createErrorHandler({ isProduction: true })(new ApiError(404, 'Note not found', 'NOT_FOUND'), fakeRequest, res, () => {});

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({ success: false, error: { code: 'NOT_FOUND', message: 'Note not found' } });
  });

  it('hides internal error messages in production', () => {
    const res = createMockResponse();
    createErrorHandler({ isProduction: true })(new Error('connection string leaked'), fakeRequest, res, () => {});

    expect(res.statusCode).to.equal(500);
    expect(res.body.error.message).to.not.include('leaked');
    expect(res.body.error.code).to.equal('INTERNAL_ERROR');
  });

  it('shows internal error messages in development to help debugging', () => {
    const res = createMockResponse();
    createErrorHandler({ isProduction: false })(new Error('Cast to ObjectId failed'), fakeRequest, res, () => {});

    expect(res.statusCode).to.equal(500);
    expect(res.body.error.message).to.equal('Cast to ObjectId failed');
  });

  it('never exposes a stack trace', () => {
    const res = createMockResponse();
    createErrorHandler({ isProduction: false })(new Error('boom'), fakeRequest, res, () => {});

    expect(JSON.stringify(res.body)).to.not.include('at ');
    expect(res.body.error).to.not.have.property('stack');
  });
});
