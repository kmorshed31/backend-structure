// Simple in-memory repository. Async to mimic a DB driver.
import { randomUUID } from 'node:crypto';

const users = new Map([
  ['1', { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' }],
  ['2', { id: '2', name: 'Linus Torvalds', email: 'linus@example.com' }],
]);

export async function list() {
  return Array.from(users.values());
}

export async function findById(id) {
  return users.get(id) || null;
}

export async function findByEmail(email) {
  email = String(email).toLowerCase();
  for (const u of users.values()) {
    if (u.email.toLowerCase() === email) return u;
  }
  return null;
}

export async function create({ name, email }) {
  const id = randomUUID();
  const user = { id, name, email };
  users.set(id, user);
  return user;
}

export async function update(id, { name, email }) {
  const existing = users.get(id);
  if (!existing) return null;
  const updated = { id, name, email };
  users.set(id, updated);
  return updated;
}

export async function remove(id) {
  return users.delete(id); // true/false
}

export async function health() {
  return { driver: 'memory', status: 'ok' };
}
