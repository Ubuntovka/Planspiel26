const request = require('supertest');
const app = require('../server');

describe('GET /api/example', () => {
  it('should return 200 and expected message', async () => {
    const res = await request(app).get('/api/example');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Success');
  });
});
