import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { vendor } from '../db/schema';

const createSchema = z.object({
  personId: z.string(),
  company: z.string(),
  trade: z.string(),
  rating: z.number().optional(),
});

const updateSchema = createSchema.partial();

const vendors = new Hono<AppEnv>();

vendors.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(vendor);
  c.get('log').set({ vendors: { count: rows.length } });
  return c.json(rows);
});

vendors.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ vendor: { id } });
  const row = await db.select().from(vendor).where(eq(vendor.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

vendors.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(vendor).values(body).returning().get();
  c.get('log').set({ vendor: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

vendors.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(vendor).set(body).where(eq(vendor.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ vendor: { id, action: 'updated' } });
  return c.json(row);
});

vendors.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(vendor).where(eq(vendor.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(vendor).where(eq(vendor.id, id));
  c.get('log').set({ vendor: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default vendors;
