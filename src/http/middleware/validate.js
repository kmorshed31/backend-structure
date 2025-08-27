import { badRequest } from '../../core/errors.js';

/** Convert Zod issues to simple {path,message} array */
function zodDetails(err) {
  return (
    err.issues?.map((i) => ({
      path: i.path.join('.') || '',
      message: i.message,
    })) || []
  );
}

/**
 * Validate request segments. Usage:
 *   validate({ body: userBody, params: idParam, query: listQuery })
 */
export function validate({ body, params, query, headers } = {}) {
  return (req, _res, next) => {
    // Note: use safeParse to avoid throwing directly; we raise AppError instead
    if (body) {
      const r = body.safeParse(req.body);
      if (!r.success) return next(badRequest('Invalid request body', zodDetails(r.error)));
      req.body = r.data; // sanitized
    }
    if (params) {
      const r = params.safeParse(req.params);
      if (!r.success) return next(badRequest('Invalid route params', zodDetails(r.error)));
      req.params = r.data;
    }
    if (query) {
      const r = query.safeParse(req.query);
      if (!r.success) return next(badRequest('Invalid query string', zodDetails(r.error)));
      req.query = r.data;
    }
    if (headers) {
      const r = headers.safeParse(req.headers);
      if (!r.success) return next(badRequest('Invalid headers', zodDetails(r.error)));
      // Usually we don’t mutate headers, so no assign back
    }
    next();
  };
}
