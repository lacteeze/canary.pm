import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { person } from './person';
import { id, timestamps } from './schema-utils';

export const property = sqliteTable(
  'property',
  {
    ...id,
    name: text('name').notNull(),
    type: text('type', { enum: ['single_family', 'multi_family', 'commercial'] }).notNull(),
    address: text('address').notNull(),
    neighbourhood: text('neighbourhood'),
    city: text('city').default("St. John's, NL"),
    units: integer('units').default(1).notNull(),
    beds: integer('beds').default(0),
    baths: integer('baths').default(0),
    sqft: integer('sqft').default(0),
    rent: integer('rent').default(0).notNull(), // monthly rent in cents
    occupancy: text('occupancy').default('vacant'),
    ownerId: text('owner_id').references(() => person.id),
    listed: integer('listed', { mode: 'boolean' }).default(false),
    listedRent: integer('listed_rent').default(0),
    yearBuilt: integer('year_built'),
    photoSeed: integer('photo_seed').default(0),
    mapX: real('map_x'),
    mapY: real('map_y'),
    ...timestamps,
  },
  (table) => [
    index('property_ownerId_idx').on(table.ownerId),
    index('property_type_idx').on(table.type),
    index('property_listed_idx').on(table.listed),
  ],
);

export type Property = InferSelectModel<typeof property>;
export type NewProperty = InferInsertModel<typeof property>;

export const propertyRelations = relations(property, ({ one }) => ({
  owner: one(person, {
    fields: [property.ownerId],
    references: [person.id],
  }),
}));
