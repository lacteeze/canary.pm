import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { portfolio } from '../db/schema';

const createSchema = z.object({
  name: z.string(),
  feeLeasing: z.number().optional(),
  feeLtm: z.number().optional(),
  feeStm: z.number().optional(),
  signed: z.string().optional(),
  term: z.string().optional(),
});

const updateSchema = createSchema.partial();

const portfolios = new Hono<AppEnv>();

portfolios.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(portfolio);
  c.get('log').set({ portfolios: { count: rows.length } });
  return c.json(rows);
});

portfolios.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ portfolio: { id } });
  const row = await db.select().from(portfolio).where(eq(portfolio.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

portfolios.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(portfolio).values(body).returning().get();
  c.get('log').set({ portfolio: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

portfolios.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(portfolio).set(body).where(eq(portfolio.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ portfolio: { id, action: 'updated' } });
  return c.json(row);
});

portfolios.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(portfolio).where(eq(portfolio.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(portfolio).where(eq(portfolio.id, id));
  c.get('log').set({ portfolio: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default portfolios;
