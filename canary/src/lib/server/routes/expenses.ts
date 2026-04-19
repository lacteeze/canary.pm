import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { expense } from '../db/schema';

const createSchema = z.object({
  projectId: z.string(),
  subProjectId: z.string().optional(),
  account: z.enum(['labour', 'materials', 'permits', 'subcontractor', 'equipment', 'disposal']),
  vendorId: z.string(),
  description: z.string().optional(),
  amount: z.number().int(),
  markup: z.number().optional(),
  billed: z.number().int().optional(),
  date: z.string(),
  status: z.enum(['pending', 'approved', 'billed']).optional(),
});

const updateSchema = createSchema.partial();

const expenses = new Hono<AppEnv>();

expenses.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(expense);
  c.get('log').set({ expenses: { count: rows.length } });
  return c.json(rows);
});

expenses.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ expense: { id } });
  const row = await db.select().from(expense).where(eq(expense.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

expenses.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(expense).values(body).returning().get();
  c.get('log').set({ expense: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

expenses.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(expense).set(body).where(eq(expense.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ expense: { id, action: 'updated' } });
  return c.json(row);
});

expenses.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(expense).where(eq(expense.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(expense).where(eq(expense.id, id));
  c.get('log').set({ expense: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default expenses;
