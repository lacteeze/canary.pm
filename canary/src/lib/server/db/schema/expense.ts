import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { project, subProject } from './project';
import { vendor } from './vendor';
import { id, timestamps } from './schema-utils';

export const expense = sqliteTable(
  'expense',
  {
    ...id,
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    subProjectId: text('sub_project_id')
      .references(() => subProject.id),
    account: text('account', {
      enum: ['labour', 'materials', 'permits', 'subcontractor', 'equipment', 'disposal'],
    }).notNull(),
    vendorId: text('vendor_id')
      .notNull()
      .references(() => vendor.id),
    description: text('description'),
    amount: integer('amount').notNull(),
    markup: real('markup').default(0),
    billed: integer('billed').default(0),
    date: text('date').notNull(),
    status: text('status', { enum: ['pending', 'approved', 'billed'] })
      .default('pending')
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index('expense_projectId_idx').on(table.projectId),
    index('expense_vendorId_idx').on(table.vendorId),
    index('expense_status_idx').on(table.status),
  ],
);

export type Expense = InferSelectModel<typeof expense>;
export type NewExpense = InferInsertModel<typeof expense>;

export const expenseRelations = relations(expense, ({ one }) => ({
  project: one(project, {
    fields: [expense.projectId],
    references: [project.id],
  }),
  subProject: one(subProject, {
    fields: [expense.subProjectId],
    references: [subProject.id],
  }),
  vendor: one(vendor, {
    fields: [expense.vendorId],
    references: [vendor.id],
  }),
}));
