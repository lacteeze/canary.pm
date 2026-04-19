import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { property } from './property';
import { vendor } from './vendor';
import { id, timestamps } from './schema-utils';

export const project = sqliteTable(
  'project',
  {
    ...id,
    title: text('title').notNull(),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id),
    vendorId: text('vendor_id')
      .notNull()
      .references(() => vendor.id),
    status: text('status', {
      enum: ['requested', 'scheduled', 'in_progress', 'on_hold', 'completed'],
    })
      .default('requested')
      .notNull(),
    priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] })
      .default('medium')
      .notNull(),
    budget: integer('budget').default(0).notNull(),
    spent: integer('spent').default(0).notNull(),
    markup: real('markup').default(0),
    isLarge: integer('is_large', { mode: 'boolean' }).default(false),
    startDate: text('start_date'),
    endDate: text('end_date'),
    dueDate: text('due_date'),
    progress: integer('progress').default(0),
    ...timestamps,
  },
  (table) => [
    index('project_propertyId_idx').on(table.propertyId),
    index('project_vendorId_idx').on(table.vendorId),
    index('project_status_idx').on(table.status),
  ],
);

export type Project = InferSelectModel<typeof project>;
export type NewProject = InferInsertModel<typeof project>;

export const subProject = sqliteTable(
  'sub_project',
  {
    ...id,
    parentId: text('parent_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    status: text('status', {
      enum: ['requested', 'scheduled', 'in_progress', 'on_hold', 'completed'],
    })
      .default('requested')
      .notNull(),
    budget: integer('budget').default(0).notNull(),
    spent: integer('spent').default(0).notNull(),
    startDate: text('start_date'),
    endDate: text('end_date'),
    vendorId: text('vendor_id').references(() => vendor.id),
    progress: integer('progress').default(0),
    ...timestamps,
  },
  (table) => [
    index('sub_project_parentId_idx').on(table.parentId),
  ],
);

export type SubProject = InferSelectModel<typeof subProject>;
export type NewSubProject = InferInsertModel<typeof subProject>;

export const projectRelations = relations(project, ({ one, many }) => ({
  property: one(property, {
    fields: [project.propertyId],
    references: [property.id],
  }),
  vendor: one(vendor, {
    fields: [project.vendorId],
    references: [vendor.id],
  }),
  subProjects: many(subProject),
}));

export const subProjectRelations = relations(subProject, ({ one }) => ({
  parent: one(project, {
    fields: [subProject.parentId],
    references: [project.id],
  }),
  vendor: one(vendor, {
    fields: [subProject.vendorId],
    references: [vendor.id],
  }),
}));
