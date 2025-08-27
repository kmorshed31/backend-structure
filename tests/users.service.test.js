import { makeUserService } from '../src/modules/users/service.js';

// Minimal in-memory fake repo per test
function makeRepo(seed = []) {
  const byId = new Map(seed.map((u) => [u.id, u]));
  return {
    async list() {
      return Array.from(byId.values());
    },
    async findById(id) {
      return byId.get(id) || null;
    },
    async findByEmail(email) {
      email = String(email).toLowerCase();
      for (const u of byId.values()) if (u.email.toLowerCase() === email) return u;
      return null;
    },
    async create({ name, email }) {
      const id = String(Date.now() + Math.random());
      const u = { id, name, email };
      byId.set(id, u);
      return u;
    },
    async update(id, { name, email }) {
      if (!byId.has(id)) return null;
      const u = { id, name, email };
      byId.set(id, u);
      return u;
    },
    async remove(id) {
      return byId.delete(id);
    },
  };
}

describe('users service (unit)', () => {
  it('creates and gets a user', async () => {
    const svc = makeUserService(makeRepo());
    const u = await svc.create({ name: 'Ada Lovelace', email: 'ada@example.com' });
    const got = await svc.get(u.id);
    expect(got.email).toBe('ada@example.com');
  });

  it('prevents duplicate email', async () => {
    const svc = makeUserService(makeRepo());
    await svc.create({ name: 'A', email: 'dup@example.com' });
    await expect(svc.create({ name: 'B', email: 'dup@example.com' })).rejects.toMatchObject({
      status: 409,
      code: 'CONFLICT',
    });
  });

  it('updates and deletes', async () => {
    const svc = makeUserService(makeRepo());
    const u = await svc.create({ name: 'X', email: 'x@x.com' });
    const up = await svc.update(u.id, { name: 'Y', email: 'y@y.com' });
    expect(up.name).toBe('Y');
    await svc.remove(u.id);
    await expect(svc.get(u.id)).rejects.toMatchObject({ status: 404 });
  });
});
