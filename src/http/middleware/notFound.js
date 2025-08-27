// src/http/middleware/notFound.js
import { notFoundErr } from '../../core/errors.js';

export function notFound(_req, _res, next) {
  next(notFoundErr('Route not found'));
}
