import { Hono } from 'hono';
import type { AppEnv } from '../index';
import { createAuth } from '../auth';

const auth = new Hono<AppEnv>();

auth.all('/*', async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

export default auth;
