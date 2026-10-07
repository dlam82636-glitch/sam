/**
 * MarketSpec Full-Stack Server Entry Point
 * Runs Express backend with Vite middleware in development
 * and static build serving in production.
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleSearchRequest } from './src/server/searchController.ts';
import { searchRateLimiter } from './src/server/security/rateLimiter.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security: Disable X-Powered-By fingerprinting
app.disable('x-powered-by');

// Security: Enforce HTTP Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Safe CSP allowing fonts and styles while blocking external inline exploits
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:;"
  );
  next();
});

// Security: Limit request body payload size (protect against large memory flood attacks)
app.use(express.json({ limit: '64kb' }));

// Health / Diagnostics endpoint (Strict: never leaks secret values)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stage: 'Prompts 1-10 (Production Deployment Ready)',
    aiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    ),
    databaseMode: process.env.DATABASE_URL ? 'postgresql' : 'in-memory-relational',
    searchConfigured: Boolean(
      (process.env.SEARCH_API_KEY && process.env.SEARCH_API_KEY !== 'MY_SEARCH_API_KEY') ||
      process.env.TAVILY_API_KEY ||
      process.env.SERPER_API_KEY
    ),
  });
});

// Primary real text-search query understanding endpoint with abuse rate limiting
app.post('/api/search', searchRateLimiter, handleSearchRequest);

// Frontend Vite Integration
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PRICERA Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[PRICERA Server] Failed to start:', err instanceof Error ? err.message : err);
  process.exit(1);
});
