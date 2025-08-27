// src/http/middleware/error.js
export function errorHandler(err, req, res, _next) {
  const status = err?.status || 500;
  const payload = {
    error: {
      message: err?.message || 'Internal Server Error',
      code: err?.code || 'INTERNAL_ERROR',
      requestId: req.id,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  };

  // Only include details in non-production
  if (process.env.NODE_ENV !== 'production') {
    if (err?.details) payload.error.details = err.details;
    if (err?.stack) payload.error.stack = err.stack;
  }

  res.status(status).json(payload);
}
