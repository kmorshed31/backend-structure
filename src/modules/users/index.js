import * as memoryRepo from './repo.memory.js';
import { makeUserService } from './service.js';

const driver = process.env.DB_DRIVER || 'memory';
let repo = memoryRepo;

if (driver === 'mongo') {
  try {
    const mongoRepo = await import('./repo.mongo.js');
    await mongoRepo.init(process.env.MONGO_URL);
    repo = mongoRepo;
    console.log('[users] Using Mongo repository');
  } catch (err) {
    console.warn('[users] Falling back to memory repo:', err?.message || err);
    repo = memoryRepo;
  }
} else if (driver !== 'memory') {
  console.warn(`[users] Unknown DB_DRIVER=${driver}, using memory repo`);
}

export const usersService = makeUserService(repo);

// Optional: health helper for /health endpoint
export async function usersHealth() {
  if (typeof repo.health === 'function') return repo.health();
  return { driver, status: 'unknown' };
}
