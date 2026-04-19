import { sqliteTable, text, real, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { person } from './person';
import { id, timestamps } from './schema-utils';

/**
 * Vendor-specific extension. Links to a person record.
 */
export const vendor = sqliteTable(
  'vendor',
  {
    ...id,
    personId: text('person_id')
      .notNull()
      .references(() => person.id, { onDelete: 'cascade' }),
    company: text('company').notNull(),
    trade: text('trade').notNull(),
    rating: real('rating').default(0),
    ...timestamps,
  },
  (table) => [
    index('vendor_personId_idx').on(table.personId),
  ],
);

export type Vendor = InferSelectModel<typeof vendor>;
export type NewVendor = InferInsertModel<typeof vendor>;

export const vendorRelations = relations(vendor, ({ one }) => ({
  person: one(person, {
    fields: [vendor.personId],
    references: [person.id],
  }),
}));
