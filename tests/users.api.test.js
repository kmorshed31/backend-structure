import request from 'supertest';

import app from '../src/app.js';

describe('Users API (integration)', () => {
  it('lists, creates, gets, updates, deletes a user', async () => {
    // List (seeded with 2 demo users from repo.memory)
    const list1 = await request(app).get('/api/users');
    expect(list1.status).toBe(200);
    expect(Array.isArray(list1.body.data)).toBe(true);
    const initialCount = list1.body.data.length;

    // Create
    const create = await request(app)
      .post('/api/users')
      .send({ name: 'Grace Hopper', email: 'grace@navy.mil' });
    expect(create.status).toBe(201);
    expect(create.body.data).toHaveProperty('id');
    const id = create.body.data.id;

    // Duplicate email → 409
    const dup = await request(app)
      .post('/api/users')
      .send({ name: 'Another', email: 'grace@navy.mil' });
    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe('CONFLICT');

    // Get by id
    const get = await request(app).get(`/api/users/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.data.email).toBe('grace@navy.mil');

    // Update
    const upd = await request(app)
      .put(`/api/users/${id}`)
      .send({ name: 'Grace H.', email: 'grace@navy.mil' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.name).toBe('Grace H.');

    // Delete
    const del = await request(app).delete(`/api/users/${id}`);
    expect(del.status).toBe(204);

    // List again (count back to initial)
    const list2 = await request(app).get('/api/users');
    expect(list2.status).toBe(200);
    expect(list2.body.data.length).toBe(initialCount);
  });

  it('validates bad input with 400', async () => {
    const bad = await request(app).post('/api/users').send({ name: 'A', email: 'not-an-email' });
    expect(bad.status).toBe(400);
    expect(bad.body.error.code).toBe('BAD_REQUEST');
    expect(Array.isArray(bad.body.error.details)).toBe(true);
  });

  it('404 for unknown id', async () => {
    const r = await request(app).get('/api/users/does-not-exist');
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe('NOT_FOUND');
  });
});
