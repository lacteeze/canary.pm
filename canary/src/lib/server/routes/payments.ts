import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { payment } from '../db/schema';

const createSchema = z.object({
  leaseId: z.string(),
  tenantId: z.string(),
  propertyId: z.string(),
  month: z.string(),
  amount: z.number().int(),
  status: z.enum(['paid', 'pending', 'overdue', 'late']).optional(),
  date: z.string(),
});

const updateSchema = createSchema.partial();

const payments = new Hono<AppEnv>();

payments.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(payment);
  c.get('log').set({ payments: { count: rows.length } });
  return c.json(rows);
});

payments.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ payment: { id } });
  const row = await db.select().from(payment).where(eq(payment.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

payments.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(payment).values(body).returning().get();
  c.get('log').set({ payment: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

payments.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(payment).set(body).where(eq(payment.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ payment: { id, action: 'updated' } });
  return c.json(row);
});

payments.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(payment).where(eq(payment.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(payment).where(eq(payment.id, id));
  c.get('log').set({ payment: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default payments;
