import { sqliteTable, text, real, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { person } from './person';
import { property } from './property';
import { id, timestamps } from './schema-utils';

export const portfolio = sqliteTable(
  'portfolio',
  {
    ...id,
    name: text('name').notNull(),
    feeLeasing: real('fee_leasing').default(0).notNull(),
    feeLtm: real('fee_ltm').default(0).notNull(),
    feeStm: real('fee_stm').default(0).notNull(),
    signed: text('signed'),
    term: text('term'),
    ...timestamps,
  },
);

export type Portfolio = InferSelectModel<typeof portfolio>;
export type NewPortfolio = InferInsertModel<typeof portfolio>;

/** Join table: which owners belong to a portfolio */
export const portfolioOwner = sqliteTable(
  'portfolio_owner',
  {
    portfolioId: text('portfolio_id')
      .notNull()
      .references(() => portfolio.id, { onDelete: 'cascade' }),
    ownerId: text('owner_id')
      .notNull()
      .references(() => person.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.portfolioId, table.ownerId] }),
    index('portfolio_owner_portfolioId_idx').on(table.portfolioId),
    index('portfolio_owner_ownerId_idx').on(table.ownerId),
  ],
);

/** Join table: which properties belong to a portfolio */
export const portfolioProperty = sqliteTable(
  'portfolio_property',
  {
    portfolioId: text('portfolio_id')
      .notNull()
      .references(() => portfolio.id, { onDelete: 'cascade' }),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.portfolioId, table.propertyId] }),
    index('portfolio_property_portfolioId_idx').on(table.portfolioId),
    index('portfolio_property_propertyId_idx').on(table.propertyId),
  ],
);

export const portfolioRelations = relations(portfolio, ({ many }) => ({
  owners: many(portfolioOwner),
  properties: many(portfolioProperty),
}));

export const portfolioOwnerRelations = relations(portfolioOwner, ({ one }) => ({
  portfolio: one(portfolio, {
    fields: [portfolioOwner.portfolioId],
    references: [portfolio.id],
  }),
  owner: one(person, {
    fields: [portfolioOwner.ownerId],
    references: [person.id],
  }),
}));

export const portfolioPropertyRelations = relations(portfolioProperty, ({ one }) => ({
  portfolio: one(portfolio, {
    fields: [portfolioProperty.portfolioId],
    references: [portfolio.id],
  }),
  property: one(property, {
    fields: [portfolioProperty.propertyId],
    references: [property.id],
  }),
}));
