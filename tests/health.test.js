import request from 'supertest';

import app from '../src/app.js';

describe('Health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.headers).toHaveProperty('x-request-id');
  });
});
