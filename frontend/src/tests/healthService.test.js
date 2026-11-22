import api, { getErrorMessage } from '../services/api';
import { fetchHealth } from '../services/healthService';

describe('healthService.fetchHealth', () => {
  afterEach(() => jest.restoreAllMocks());

  it('requests /health and returns the report', async () => {
    const report = { status: 'ok', services: { api: 'up', database: 'connected' } };
    const getSpy = jest.spyOn(api, 'get').mockResolvedValue({ data: { success: true, data: report } });

    await expect(fetchHealth()).resolves.toEqual(report);
    expect(getSpy).toHaveBeenCalledWith('/health', expect.objectContaining({ validateStatus: expect.any(Function) }));
  });

  it('treats 200 and 503 as valid answers but not other statuses', async () => {
    const getSpy = jest.spyOn(api, 'get').mockResolvedValue({ data: { data: {} } });
    await fetchHealth();
    const { validateStatus } = getSpy.mock.calls[0][1];

    expect(validateStatus(200)).toBe(true);
    expect(validateStatus(503)).toBe(true);
    expect(validateStatus(500)).toBe(false);
    expect(validateStatus(404)).toBe(false);
  });
});

describe('api.getErrorMessage', () => {
  it('prefers the message sent by the API', () => {
    const error = { response: { data: { error: { message: 'Note not found' } } } };
    expect(getErrorMessage(error)).toBe('Note not found');
  });

  it('explains timeouts', () => {
    expect(getErrorMessage({ code: 'ECONNABORTED' })).toBe('The server took too long to respond.');
  });

  it('explains when the server cannot be reached', () => {
    expect(getErrorMessage({ request: {} })).toBe('Cannot reach the server. Is the backend running?');
  });

  it('falls back to a generic message', () => {
    expect(getErrorMessage(new Error('weird'))).toBe('Something went wrong. Please try again.');
  });
});
