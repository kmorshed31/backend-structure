// src/core/config.js
import dotenv from 'dotenv';
dotenv.config(); // ensure .env is loaded before reading process.env

const number = (val, fallback) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

function required(name, val) {
  if (val === undefined || val === null || String(val).trim() === '') {
    throw new Error(`Missing required env: ${name}`);
  }
  return val;
}

export function loadConfig() {
  const env = process.env.NODE_ENV || 'development';

  const PORT = number(required('PORT', process.env.PORT), NaN);

  const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
  const RATE_LIMIT_WINDOW_MS = number(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
  const RATE_LIMIT_MAX = number(process.env.RATE_LIMIT_MAX, 100);

  if (!Number.isFinite(PORT)) throw new Error('PORT must be a valid number');

  return {
    env,
    port: PORT,
    corsOrigin: CORS_ORIGIN,
    rateLimit: { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX },
  };
}
