import { seed, reset } from 'drizzle-seed';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../schema';

// Exclude auth tables and join tables (composite PKs break drizzle-seed)
const {
  account: _account,
  session: _session,
  verification: _verification,
  twoFactor: _twoFactor,
  invitation: _invitation,
  member: _member,
  organization: _organization,
  portfolioOwner: _portfolioOwner,
  portfolioProperty: _portfolioProperty,
  ...seedSchema
} = schema;

// D1 has a 100 bind-parameter limit per statement.
// drizzle-seed inserts all rows in one statement, so:
//   max_rows = floor(100 / num_columns)
//
// user:        11 cols → 9 rows
// person:       9 cols → 11 rows
// vendor:       9 cols → 11 rows
// property:    23 cols → 4 rows
// portfolio:   10 cols → 10 rows
// lease:       13 cols → 7 rows
// payment:     14 cols → 7 rows
// project:     19 cols → 5 rows
// sub_project: 15 cols → 6 rows
// expense:     17 cols → 5 rows

export async function runSeed(d1: D1Database) {
  const db = drizzle(d1);

  await reset(db, schema);

  await seed(db, seedSchema, { seed: 42 }).refine((f) => ({

    // 9 users: 1 manager + 3 owners + 3 tenants + 2 vendor contacts
    user: {
      count: 9,
      columns: {
        name: f.valuesFromArray({
          values: [
            'Aidan Flynn', 'Declan Murphy', 'Ciara Power', 'Niamh Fitzpatrick',
            'Maeve Walsh', 'Conor Doyle', 'Ronan Hickey',
            'Brendan Foley', 'Saoirse Whelan',
          ],
        }),
        email: f.valuesFromArray({
          values: [
            'aidan@canary.pm', 'declan@harbourholdings.ca', 'ciara@signalhillcap.ca', 'niamh@eastendpartners.ca',
            'maeve.walsh@gmail.com', 'conor.doyle@gmail.com', 'ronan.hickey@outlook.com',
            'brendan@avalonplumbing.ca', 'saoirse@rocksoldroofing.ca',
          ],
        }),
        emailVerified: f.default({ defaultValue: true }),
      },
    },

    // 9 persons matching users
    person: {
      count: 9,
      columns: {
        phone: f.valuesFromArray({
          values: [
            '709-555-0100', '709-555-0201', '709-555-0202', '709-555-0203',
            '709-555-0301', '709-555-0302', '709-555-0303',
            '709-555-0401', '709-555-0402',
          ],
        }),
        role: f.valuesFromArray({
          values: ['manager', 'owner', 'owner', 'owner', 'tenant', 'tenant', 'tenant', 'vendor', 'vendor'],
        }),
        since: f.valuesFromArray({
          values: [2024, 2024, 2025, 2023, 2025, 2024, 2026, 2023, 2024],
        }),
      },
    },

    // 2 vendors
    vendor: {
      count: 2,
      columns: {
        company: f.valuesFromArray({ values: ['Avalon Plumbing', 'Rock Solid Roofing'] }),
        trade: f.valuesFromArray({ values: ['Plumbing', 'Roofing'] }),
        rating: f.valuesFromArray({ values: [4.8, 4.9] }),
      },
    },

    // 4 properties (max for 23 cols)
    property: {
      count: 4,
      columns: {
        name: f.valuesFromArray({
          values: ['Gower Heights', 'Duckworth Terrace', 'Signal Row', 'Harbour Point'],
        }),
        type: f.valuesFromArray({
          values: ['single_family', 'multi_family', 'single_family', 'commercial'],
        }),
        address: f.valuesFromArray({
          values: ['42 Gower St', '88 Duckworth St', '15 Signal Hill Rd', '200 Water St'],
        }),
        neighbourhood: f.valuesFromArray({
          values: ['Downtown', 'Downtown', 'The Battery', 'Harbourside'],
        }),
        city: f.default({ defaultValue: "St. John's, NL" }),
        units: f.valuesFromArray({ values: [1, 6, 1, 3] }),
        beds: f.valuesFromArray({ values: [3, 2, 4, 0] }),
        baths: f.valuesFromArray({ values: [2, 1, 3, 2] }),
        sqft: f.valuesFromArray({ values: [1850, 950, 2400, 4200] }),
        rent: f.valuesFromArray({ values: [2800, 1950, 3200, 5500] }),
        occupancy: f.valuesFromArray({ values: ['occupied', 'occupied', 'occupied', 'vacant'] }),
        listed: f.valuesFromArray({ values: [false, true, true, true] }),
        listedRent: f.valuesFromArray({ values: [0, 1950, 3200, 5500] }),
        yearBuilt: f.valuesFromArray({ values: [1922, 1965, 2018, 1890] }),
        photoSeed: f.valuesFromArray({ values: [1, 2, 3, 4] }),
        mapX: f.valuesFromArray({ values: [47.56, 47.57, 47.58, 47.57] }),
        mapY: f.valuesFromArray({ values: [-52.71, -52.70, -52.69, -52.71] }),
      },
    },

    // 3 portfolios
    portfolio: {
      count: 3,
      columns: {
        name: f.valuesFromArray({
          values: ['Harbour Holdings', 'Signal Hill Capital', 'East End Partners'],
        }),
        feeLeasing: f.valuesFromArray({ values: [50, 100, 75] }),
        feeLtm: f.valuesFromArray({ values: [8, 10, 9] }),
        feeStm: f.valuesFromArray({ values: [20, 22, 18] }),
        signed: f.valuesFromArray({ values: ['2024-06-14', '2025-01-02', '2023-09-20'] }),
        term: f.valuesFromArray({ values: ['2-year', '1-year', '3-year'] }),
      },
    },

    // 5 leases
    lease: {
      count: 5,
      columns: {
        rent: f.valuesFromArray({ values: [2800, 1950, 1950, 3200, 1950] }),
        startDate: f.valuesFromArray({
          values: ['2024-05-01', '2024-09-01', '2025-01-01', '2025-03-01', '2024-07-01'],
        }),
        endDate: f.valuesFromArray({
          values: ['2025-04-30', '2025-08-31', '2025-12-31', '2026-02-28', '2025-06-30'],
        }),
        status: f.valuesFromArray({
          values: ['active', 'active', 'active', 'ending_soon', 'renewal_sent'],
        }),
        balance: f.valuesFromArray({ values: [0, 0, 1950, 0, 0] }),
      },
    },

    // 7 payments
    payment: {
      count: 7,
      columns: {
        month: f.valuesFromArray({
          values: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'Mar 2026', 'Apr 2026', 'Apr 2026'],
        }),
        amount: f.valuesFromArray({ values: [2800, 2800, 2800, 2800, 1950, 1950, 3200] }),
        status: f.valuesFromArray({
          values: ['paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'overdue'],
        }),
        date: f.valuesFromArray({
          values: ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-03-01', '2026-04-01', '2026-04-01'],
        }),
      },
    },

    // 5 projects
    project: {
      count: 5,
      columns: {
        title: f.valuesFromArray({
          values: [
            'Roof inspection & patch', 'Furnace replacement', 'Kitchen refresh — unit 2B',
            'Exterior paint touch-ups', 'Annual fire inspection',
          ],
        }),
        status: f.valuesFromArray({
          values: ['completed', 'in_progress', 'scheduled', 'requested', 'completed'],
        }),
        priority: f.valuesFromArray({
          values: ['medium', 'high', 'medium', 'low', 'urgent'],
        }),
        budget: f.valuesFromArray({ values: [4500, 12000, 8500, 3200, 800] }),
        spent: f.valuesFromArray({ values: [4200, 7800, 0, 0, 780] }),
        markup: f.valuesFromArray({ values: [15, 20, 15, 10, 0] }),
        isLarge: f.valuesFromArray({ values: [false, true, true, false, false] }),
        startDate: f.valuesFromArray({
          values: ['2026-03-10', '2026-03-20', '2026-05-01', '2026-04-15', '2026-04-01'],
        }),
        endDate: f.valuesFromArray({
          values: ['2026-03-12', '2026-05-15', '2026-06-15', '2026-04-20', '2026-04-01'],
        }),
        dueDate: f.valuesFromArray({
          values: ['2026-03-15', '2026-05-15', '2026-06-15', '2026-04-25', '2026-04-05'],
        }),
        progress: f.valuesFromArray({ values: [100, 65, 0, 0, 100] }),
      },
    },

    // 5 sub-projects (for the 2 large projects)
    subProject: {
      count: 5,
      columns: {
        title: f.valuesFromArray({
          values: ['Demo & tear-out', 'HVAC swap', 'Ductwork refresh', 'Cabinet demo', 'Countertops install'],
        }),
        status: f.valuesFromArray({
          values: ['completed', 'in_progress', 'scheduled', 'completed', 'scheduled'],
        }),
        budget: f.valuesFromArray({ values: [3000, 5000, 4000, 2500, 3500] }),
        spent: f.valuesFromArray({ values: [2800, 3200, 0, 2400, 0] }),
        startDate: f.valuesFromArray({
          values: ['2026-03-20', '2026-04-05', '2026-04-20', '2026-05-01', '2026-05-15'],
        }),
        endDate: f.valuesFromArray({
          values: ['2026-04-02', '2026-04-18', '2026-05-05', '2026-05-10', '2026-05-25'],
        }),
        progress: f.valuesFromArray({ values: [100, 60, 0, 100, 0] }),
      },
    },

    // 5 expenses
    expense: {
      count: 5,
      columns: {
        account: f.valuesFromArray({
          values: ['labour', 'materials', 'labour', 'permits', 'materials'],
        }),
        description: f.valuesFromArray({
          values: [
            'Roofer day rate — inspection', 'Shingles & flashing materials',
            'HVAC technician — 3 days', 'City building permit',
            'Furnace unit (Lennox SL280)',
          ],
        }),
        amount: f.valuesFromArray({ values: [1800, 2400, 4500, 350, 5200] }),
        markup: f.valuesFromArray({ values: [15, 15, 20, 0, 10] }),
        billed: f.valuesFromArray({ values: [2070, 2760, 5400, 350, 5720] }),
        date: f.valuesFromArray({
          values: ['2026-03-10', '2026-03-11', '2026-04-05', '2026-03-18', '2026-03-22'],
        }),
        status: f.valuesFromArray({
          values: ['billed', 'billed', 'approved', 'billed', 'pending'],
        }),
      },
    },
  }));

  return { message: 'Seed complete' };
}
