const request = require('supertest');
const app = require('../server');

describe('App', () => {
  it('should return 404 for non-existent routes', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.statusCode).toEqual(404);
  });
});
