import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { lease } from '../db/schema';

const createSchema = z.object({
  tenantId: z.string(),
  propertyId: z.string(),
  rent: z.number().int(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['active', 'ending_soon', 'renewal_sent', 'expired', 'terminated']).optional(),
  balance: z.number().int().optional(),
});

const updateSchema = createSchema.partial();

const leases = new Hono<AppEnv>();

leases.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(lease);
  c.get('log').set({ leases: { count: rows.length } });
  return c.json(rows);
});

leases.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ lease: { id } });
  const row = await db.select().from(lease).where(eq(lease.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

leases.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(lease).values(body).returning().get();
  c.get('log').set({ lease: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

leases.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(lease).set(body).where(eq(lease.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ lease: { id, action: 'updated' } });
  return c.json(row);
});

leases.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(lease).where(eq(lease.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(lease).where(eq(lease.id, id));
  c.get('log').set({ lease: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default leases;
