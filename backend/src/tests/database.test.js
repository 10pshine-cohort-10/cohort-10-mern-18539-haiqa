import { expect } from 'chai';
import { connectDatabase, connectWithRetry, describeReadyState, getDatabaseStatus, retryDelay } from '../config/database.js';

describe('database helpers', () => {
  it('maps every Mongoose readyState to a readable word', () => {
    expect(describeReadyState(0)).to.equal('disconnected');
    expect(describeReadyState(1)).to.equal('connected');
    expect(describeReadyState(2)).to.equal('connecting');
    expect(describeReadyState(3)).to.equal('disconnecting');
    expect(describeReadyState(99)).to.equal('unknown');
  });

  it('reports "disconnected" before any connection is opened', () => {
    expect(getDatabaseStatus()).to.equal('disconnected');
  });

  it('refuses to connect without a connection string', async () => {
    let caught;
    try {
      await connectDatabase('');
    } catch (error) {
      caught = error;
    }
    expect(caught).to.be.instanceOf(Error);
    expect(caught.message).to.match(/connection string is required/);
  });

  it('waits longer after each failed attempt, up to 30 seconds', () => {
    expect([1, 2, 3, 4, 5, 6].map(retryDelay)).to.deep.equal([2000, 4000, 8000, 16000, 30000, 30000]);
  });

  it('retries a failed first connection until it succeeds', async () => {
    let calls = 0;
    /** @type {Array<[number, number]>} */
    const retries = [];
    const connection = connectWithRetry('mongodb://example', {
      baseDelayMs: 1,
      connect: async () => {
        calls += 1;
        if (calls < 3) throw new Error('MongoDB is down');
      },
      onRetry: (attempt, delayMs) => retries.push([attempt, delayMs]),
    });
    expect(await connection.done).to.equal(true);
    expect(calls).to.equal(3);
    expect(retries).to.deep.equal([
      [1, 1],
      [2, 2],
    ]);
  });

  it('stops retrying once cancelled', async () => {
    let calls = 0;
    const connection = connectWithRetry('mongodb://example', {
      connect: async () => {
        calls += 1;
        throw new Error('MongoDB is down');
      },
      onRetry: () => connection.cancel(),
    });
    expect(await connection.done).to.equal(false);
    expect(calls).to.equal(1);
  });

  it('reports false if cancelled while a connection attempt is still pending', async () => {
    /** @type {() => void} */
    let finishConnect = () => {};
    const connection = connectWithRetry('mongodb://example', {
      connect: () =>
        new Promise((resolve) => {
          finishConnect = resolve;
        }),
    });
    connection.cancel();
    finishConnect();
    expect(await connection.done).to.equal(false);
  });
});
