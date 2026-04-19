import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../index';
import { person, user } from '../db/schema';

const roleEnum = z.enum(['owner', 'tenant', 'vendor', 'manager']);

const createSchema = z.object({
  userId: z.string().optional(),
  phone: z.string().optional(),
  role: roleEnum,
  since: z.number().int().optional(),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  role: roleEnum.optional(),
});

const people = new Hono<AppEnv>();

people.get('/', zValidator('query', querySchema), async (c) => {
  const db = c.get('db');
  const { role } = c.req.valid('query');
  const query = db
    .select({
      id: person.id,
      userId: person.userId,
      phone: person.phone,
      role: person.role,
      since: person.since,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(person)
    .leftJoin(user, eq(person.userId, user.id));
  const rows = role ? await query.where(eq(person.role, role)) : await query;
  c.get('log').set({ people: { count: rows.length } });
  return c.json(rows);
});

people.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  c.get('log').set({ person: { id } });
  const row = await db
    .select({
      id: person.id,
      userId: person.userId,
      phone: person.phone,
      role: person.role,
      since: person.since,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(person)
    .leftJoin(user, eq(person.userId, user.id))
    .where(eq(person.id, id))
    .get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  return c.json(row);
});

people.post('/', zValidator('json', createSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');
  const row = await db.insert(person).values(body).returning().get();
  c.get('log').set({ person: { id: row.id, action: 'created' } });
  return c.json(row, 201);
});

people.put('/:id', zValidator('json', updateSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const row = await db.update(person).set(body).where(eq(person.id, id)).returning().get();
  if (!row) return c.json({ error: 'Not found', status: 404 }, 404);
  c.get('log').set({ person: { id, action: 'updated' } });
  return c.json(row);
});

people.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const existing = await db.select().from(person).where(eq(person.id, id)).get();
  if (!existing) return c.json({ error: 'Not found', status: 404 }, 404);
  await db.delete(person).where(eq(person.id, id));
  c.get('log').set({ person: { id, action: 'deleted' } });
  return c.body(null, 204);
});

export default people;
