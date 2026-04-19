import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { person } from './person';
import { property } from './property';
import { id, timestamps } from './schema-utils';

export const lease = sqliteTable(
  'lease',
  {
    ...id,
    tenantId: text('tenant_id')
      .notNull()
      .references(() => person.id),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id),
    rent: integer('rent').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    status: text('status', { enum: ['active', 'ending_soon', 'renewal_sent', 'expired', 'terminated'] })
      .default('active')
      .notNull(),
    balance: integer('balance').default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    index('lease_tenantId_idx').on(table.tenantId),
    index('lease_propertyId_idx').on(table.propertyId),
    index('lease_status_idx').on(table.status),
  ],
);

export type Lease = InferSelectModel<typeof lease>;
export type NewLease = InferInsertModel<typeof lease>;

export const leaseRelations = relations(lease, ({ one }) => ({
  tenant: one(person, {
    fields: [lease.tenantId],
    references: [person.id],
  }),
  property: one(property, {
    fields: [lease.propertyId],
    references: [property.id],
  }),
}));
