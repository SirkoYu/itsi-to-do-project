process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

import request from 'supertest';
import { app } from '../app';
import { initDatabase } from '../database';

let token: string;

beforeAll(async () => {
  await initDatabase();

  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'tasks@example.com', password: 'password123' });

  token = res.body.data.token;
});

describe('GET /api/v1/tasks', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(401);
  });

  it('returns empty array for new user', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /api/v1/tasks', () => {
  it('creates a task and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test task', description: 'A description' });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.title).toBe('Test task');
    expect(res.body.data.completed).toBe(0);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'No title' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('PATCH /api/v1/tasks/:id/toggle', () => {
  it('toggles completed status', async () => {
    const create = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Toggle me' });

    const id = create.body.data.id;

    const toggled = await request(app)
      .patch(`/api/v1/tasks/${id}/toggle`)
      .set('Authorization', `Bearer ${token}`);

    expect(toggled.status).toBe(200);
    expect(toggled.body.data.completed).toBe(1);
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  it('deletes a task and returns 204', async () => {
    const create = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete me' });

    const id = create.body.data.id;

    const del = await request(app)
      .delete(`/api/v1/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(204);
  });

  it('returns 404 for non-existent task', async () => {
    const res = await request(app)
      .delete('/api/v1/tasks/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
