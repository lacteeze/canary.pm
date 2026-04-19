import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { lease } from './lease';
import { person } from './person';
import { property } from './property';
import { id, timestamps } from './schema-utils';

export const payment = sqliteTable(
  'payment',
  {
    ...id,
    leaseId: text('lease_id')
      .notNull()
      .references(() => lease.id),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => person.id),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id),
    month: text('month').notNull(),
    amount: integer('amount').notNull(),
    status: text('status', { enum: ['paid', 'pending', 'overdue', 'late'] })
      .default('pending')
      .notNull(),
    date: text('date').notNull(),
    ...timestamps,
  },
  (table) => [
    index('payment_leaseId_idx').on(table.leaseId),
    index('payment_tenantId_idx').on(table.tenantId),
    index('payment_propertyId_idx').on(table.propertyId),
    index('payment_status_idx').on(table.status),
  ],
);

export type Payment = InferSelectModel<typeof payment>;
export type NewPayment = InferInsertModel<typeof payment>;

export const paymentRelations = relations(payment, ({ one }) => ({
  lease: one(lease, {
    fields: [payment.leaseId],
    references: [lease.id],
  }),
  tenant: one(person, {
    fields: [payment.tenantId],
    references: [person.id],
  }),
  property: one(property, {
    fields: [payment.propertyId],
    references: [property.id],
  }),
}));
