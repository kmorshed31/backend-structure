// Business logic. No Express here.
import { conflict, notFoundErr } from '../../core/errors.js';

export function makeUserService(repo) {
  return {
    async list() {
      return repo.list();
    },

    async get(id) {
      const user = await repo.findById(id);
      if (!user) throw notFoundErr('User not found');
      return user;
    },

    async create(input) {
      // assume routing validation already checked shape
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();

      const dup = await repo.findByEmail(email);
      if (dup) throw conflict('Email already in use', [{ path: 'email' }]);

      return repo.create({ name, email });
    },

    async update(id, input) {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();

      const exists = await repo.findById(id);
      if (!exists) throw notFoundErr('User not found');

      const dup = await repo.findByEmail(email);
      if (dup && dup.id !== id) {
        throw conflict('Email already in use', [{ path: 'email' }]);
      }

      const updated = await repo.update(id, { name, email });
      return updated;
    },

    async remove(id) {
      const ok = await repo.remove(id);
      if (!ok) throw notFoundErr('User not found');
      return;
    },
  };
}
