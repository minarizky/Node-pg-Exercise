const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll(async () => {
  // Set up the database for testing, if needed
});

afterAll(async () => {
  await db.end();
});

describe('Companies Routes', () => {
  test('GET /companies - should return a list of companies', async () => {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('companies');
  });

  test('GET /companies/:code - should return a single company', async () => {
    const response = await request(app).get('/companies/c1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('company');
  });

  // Add more tests for POST, PUT, DELETE routes
});
