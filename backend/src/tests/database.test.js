import { expect } from 'chai';
import { connectDatabase, describeReadyState, getDatabaseStatus } from '../config/database.js';

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
});
