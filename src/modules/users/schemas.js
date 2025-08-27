import { z } from 'zod';

export const userBody = z.object({
  name: z.string().min(2, 'name must be at least 2 characters'),
  email: z.string().email('email must be valid'),
});

export const idParam = z.object({
  id: z.string().min(1, 'id is required'),
});

// Optional example if you later list with filters:
// export const listQuery = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   perPage: z.coerce.number().int().min(1).max(100).default(20)
// }).partial(); // all optional
