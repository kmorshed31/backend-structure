// src/core/errors.js
export class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Convenience creators
export const badRequest = (msg = 'Bad request', details) =>
  new AppError(msg, 400, 'BAD_REQUEST', details);

export const unauthorized = (msg = 'Unauthorized', details) =>
  new AppError(msg, 401, 'UNAUTHORIZED', details);

export const forbidden = (msg = 'Forbidden', details) =>
  new AppError(msg, 403, 'FORBIDDEN', details);

export const notFoundErr = (msg = 'Not found', details) =>
  new AppError(msg, 404, 'NOT_FOUND', details);

export const conflict = (msg = 'Conflict', details) => new AppError(msg, 409, 'CONFLICT', details);

export const unprocessable = (msg = 'Unprocessable Entity', details) =>
  new AppError(msg, 422, 'UNPROCESSABLE_ENTITY', details);

export const notImplemented = (msg = 'Not implemented', details) =>
  new AppError(msg, 501, 'NOT_IMPLEMENTED', details);
