import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { user } from './auth.schema';
import { id, timestamps } from './schema-utils';

/**
 * Extends the auth `user` table with PM-specific profile data.
 * Every person in the system (owner, tenant, vendor contact) gets a row here.
 */
export const person = sqliteTable(
  'person',
  {
    ...id,
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    phone: text('phone'),
    role: text('role', { enum: ['owner', 'tenant', 'vendor', 'manager'] }).notNull(),
    since: integer('since'), // year they started with canary
    ...timestamps,
  },
  (table) => [
    index('person_userId_idx').on(table.userId),
    index('person_role_idx').on(table.role),
  ],
);

export type Person = InferSelectModel<typeof person>;
export type NewPerson = InferInsertModel<typeof person>;

export const personRelations = relations(person, ({ one }) => ({
  user: one(user, {
    fields: [person.userId],
    references: [user.id],
  }),
}));
