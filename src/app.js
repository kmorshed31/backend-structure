import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';

import router from './http/router/index.js';
import { notFound } from './http/middleware/notFound.js';
import { errorHandler } from './http/middleware/error.js';
import { requestId } from './http/middleware/requestId.js';
import { loadConfig } from './core/config.js';
import { usersHealth } from './modules/users/index.js';

const cfg = loadConfig();
const app = express();

// Paths to docs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OPENAPI_PATH = path.join(__dirname, '..', 'docs', 'openapi.json');
const openapiDoc = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf-8'));

// Security & parsing
app.use(helmet());
app.use(cors({ origin: cfg.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Request ID + logging
app.use(requestId);
morgan.token('id', (req) => req.id);
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':id :method :url :status :response-time ms'));
}

// Health
app.get('/health', async (_req, res) => {
  const db = await usersHealth();
  res.status(200).json({ status: 'ok', db });
});

// Docs: JSON spec + Swagger UI
app.get('/docs/openapi.json', (_req, res) => res.sendFile(OPENAPI_PATH));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc, { explorer: true }));

// API routes
app.use('/api', router);

// 404 + error
app.use(notFound);
app.use(errorHandler);

export default app;
