import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { property } from '../db/schema';

const createSchema = z.object({
  name: z.string(),
  type: z.enum(['single_family', 'multi_family', 'commercial']),
  address: z.string(),
  neighbourhood: z.string().optional(),
  city: z.string().optional(),
  units: z.number().int().optional(),
  beds: z.number().int().optional(),
  baths: z.number().int().optional(),
  sqft: z.number().int().optional(),
  rent: z.number().int().optional(),
  occupancy: z.string().optional(),
  ownerId: z.string().optional(),
  listed: z.boolean().optional(),
  listedRent: z.number().int().optional(),
  yearBuilt: z.number().int().optional(),
  photoSeed: z.number().int().optional(),
  mapX: z.number().optional(),
  mapY: z.number().optional(),
});

const updateSchema = createSchema.partial();

const properties = new Hono<AppEnv>();

properties.get('/', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(property);
  c.get('log').set({ properties: { count: rows.length } });
  return c.json(rows);
});

properties.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ property: { id } });
  const row = await db.select().from(property).where(eq(property.id, id)).get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

properties.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(property).values(body).returning().get();
  c.get('log').set({ property: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

properties.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(property).set(body).where(eq(property.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ property: { id, action: 'updated' } });
  return c.json(row);
});

properties.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(property).where(eq(property.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(property).where(eq(property.id, id));
  c.get('log').set({ property: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default properties;
