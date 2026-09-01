import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('Cafes API Endpoints', () => {
  it('GET /health returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('CafeFinder API');
  });

  it('GET /api/cafes/search returns Lumban cafe search results', async () => {
    const res = await request(app).get('/api/cafes/search?lat=14.2977&lng=121.4596&radius=10000');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.cafes)).toBe(true);
    expect(res.body.data.cafes.length).toBeGreaterThan(0);
  });

  it('GET /api/cafes/:placeId returns real Nicafe Lumban details', async () => {
    const res = await request(app).get('/api/cafes/real_niface_lumban');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Nicafé Caliraya');
    expect(res.body.data.rating).toBe(4.8);
  });
});
