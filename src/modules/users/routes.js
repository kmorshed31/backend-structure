import { Router } from 'express';

import * as ctrl from './controller.js';
import { validate } from '../../http/middleware/validate.js';
import { asyncHandler } from '../../http/middleware/asyncHandler.js';
import { userBody, idParam } from './schemas.js';

const r = Router();

// List (no validation needed yet)
// Wrap with asyncHandler for future async controllers
r.get('/', asyncHandler(ctrl.list));

// Get by id
r.get('/:id', validate({ params: idParam }), asyncHandler(ctrl.get));

// Create
r.post('/', validate({ body: userBody }), asyncHandler(ctrl.create));

// Update
r.put('/:id', validate({ params: idParam, body: userBody }), asyncHandler(ctrl.update));

// Delete
r.delete('/:id', validate({ params: idParam }), asyncHandler(ctrl.remove));

export default r;
