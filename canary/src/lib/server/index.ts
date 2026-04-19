import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { initLogger, parseError } from 'evlog';
import { evlog, type EvlogVariables } from 'evlog/hono';
import { createDb } from './db';
import type { User, Session } from './db/schema/auth.schema-types';
import { sessionMiddleware, requireAuth } from './middleware/session';
import auth from './routes/auth';
import dev from './routes/dev';
import properties from './routes/properties';
import people from './routes/people';
import leases from './routes/leases';
import payments from './routes/payments';
import portfolios from './routes/portfolios';
import projects from './routes/projects';
import vendors from './routes/vendors';
import expenses from './routes/expenses';

initLogger({
  env: { service: 'canary-api' },
});

export type AppEnv = EvlogVariables & {
  Bindings: Env;
  Variables: {
    db: ReturnType<typeof createDb>;
    user: User | null;
    session: Session | null;
  };
};

const app = new Hono<AppEnv>();

// CORS
app.use('/api/*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN,
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// Secure headers
app.use('/api/*', secureHeaders());

// Logging
app.use('/api/*', evlog({
  exclude: ['/api/dev/health'],
  routes: {
    '/api/auth/**': { service: 'auth' },
  },
}));

// Error handling
app.onError((error, c) => {
  c.get('log').error(error);

  const msg = error?.message ?? '';

  if (msg.includes('UNIQUE constraint failed')) {
    return Response.json({ error: 'Resource already exists', status: 409 }, { status: 409 });
  }
  if (msg.includes('FOREIGN KEY constraint failed')) {
    return Response.json({ error: 'Referenced resource not found', status: 422 }, { status: 422 });
  }
  if (msg.includes('NOT NULL constraint failed')) {
    return Response.json({ error: 'Missing required field', status: 422 }, { status: 422 });
  }

  const parsed = parseError(error);
  const status = parsed.status || 500;
  return Response.json({ error: parsed.message, status }, { status });
});

// Inject drizzle db instance
app.use('/api/*', async (c, next) => {
  c.set('db', createDb(c.env.DB));
  await next();
});

// Auth middleware — protect resource routes
const protectedPaths = [
  '/api/properties/*',
  '/api/people/*',
  '/api/leases/*',
  '/api/payments/*',
  '/api/portfolios/*',
  '/api/projects/*',
  '/api/vendors/*',
  '/api/expenses/*',
];
for (const path of protectedPaths) {
  app.use(path, sessionMiddleware, requireAuth);
}

// Mount routes
app.route('/api/auth', auth);
app.route('/api/dev', dev);
app.route('/api/properties', properties);
app.route('/api/people', people);
app.route('/api/leases', leases);
app.route('/api/payments', payments);
app.route('/api/portfolios', portfolios);
app.route('/api/projects', projects);
app.route('/api/vendors', vendors);
app.route('/api/expenses', expenses);

export default app;
