import dotenv from 'dotenv';
dotenv.config();

import http from 'http';

import app from './app.js';
import { loadConfig } from './core/config.js';
import { log } from './core/logger.js';

const config = loadConfig();

const server = http.createServer(app);
server.listen(config.port, () => {
  log.info(`API running on http://localhost:${config.port}`);
});

process.on('unhandledRejection', (err) => {
  log.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
