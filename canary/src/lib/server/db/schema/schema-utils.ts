import { text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/** nanoid-style random ID, 21 chars */
function generateId() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let id = '';
  const bytes = crypto.getRandomValues(new Uint8Array(21));
  for (const b of bytes) id += chars[b % chars.length];
  return id;
}

/** Standard text primary key with auto-generated ID */
export const id = {
  id: text('id').primaryKey().$defaultFn(generateId),
};

/** createdAt + updatedAt timestamp columns */
export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' as const })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' as const })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
};

/** Generate a URL-safe slug from a string */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
