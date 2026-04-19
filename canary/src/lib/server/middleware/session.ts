import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../index';
import { createAuth } from '../auth';

export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const auth = createAuth(c.env);
  const result = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!result) {
    c.set('user', null);
    c.set('session', null);
    await next();
    return;
  }

  c.set('user', result.user);
  c.set('session', result.session);
  await next();
});

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get('user');
  const session = c.get('session');

  if (!user || !session) {
    return c.json({ error: 'Unauthorized', status: 401 }, 401);
  }

  await next();
});
