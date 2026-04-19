import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { project } from '../db/schema';

const createSchema = z.object({
  title: z.string(),
  propertyId: z.string(),
  vendorId: z.string(),
  status: z.enum(['requested', 'scheduled', 'in_progress', 'on_hold', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  budget: z.number().int().optional(),
  spent: z.number().int().optional(),
  markup: z.number().optional(),
  isLarge: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dueDate: z.string().optional(),
  progress: z.number().int().optional(),
});

const updateSchema = createSchema.partial();

const projects = new Hono<AppEnv>();

projects.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(project);
  c.get('log').set({ projects: { count: rows.length } });
  return c.json(rows);
});

projects.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ project: { id } });
  const row = await db.select().from(project).where(eq(project.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

projects.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(project).values(body).returning().get();
  c.get('log').set({ project: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

projects.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(project).set(body).where(eq(project.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ project: { id, action: 'updated' } });
  return c.json(row);
});

projects.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(project).where(eq(project.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(project).where(eq(project.id, id));
  c.get('log').set({ project: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default projects;
