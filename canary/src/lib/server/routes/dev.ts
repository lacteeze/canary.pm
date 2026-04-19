import { Hono } from 'hono';
import type { AppEnv } from '../index';

const dev = new Hono<AppEnv>();

dev.get('/health', (c) => c.json({ ok: true }));

dev.post('/seed', async (c) => {
  const log = c.get('log');
  log.set({ action: 'seed_database' });
  const { runSeed } = await import('../db/seed');
  const result = await runSeed(c.env.DB);
  log.set({ seed: { result } });
  return c.json(result);
});

export default dev;
