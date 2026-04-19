/* Seed data for Canary.pm — St. John's, NL anchored */

const NL_STREETS = [
  "Gower St", "Water St", "Duckworth St", "Signal Hill Rd", "Military Rd",
  "Forest Rd", "Kings Rd", "Queens Rd", "Bond St", "New Gower St",
  "Harvey Rd", "LeMarchant Rd", "Elizabeth Ave", "Torbay Rd", "Topsail Rd",
  "Prince of Wales St", "Waterford Bridge Rd", "Rennies Mill Rd", "Circular Rd", "Monkstown Rd"
];

const NEIGHBOURHOODS = ["Downtown", "Georgestown", "Rabbittown", "Churchill Square", "The Battery", "Quidi Vidi", "Waterford Valley", "Kenmount", "Cowan Heights", "Pleasantville"];

const FIRST_NAMES = ["Aidan","Siobhan","Liam","Maeve","Cian","Niamh","Ronan","Declan","Ciara","Fergus","Brigid","Kieran","Aislinn","Padraig","Oonagh","Eamon","Saoirse","Tadhg","Cormac","Orla","Finnian","Roisin","Brendan","Sinead","Conor","Eileen","Gerard","Maura","Sean","Caitlin"];
const LAST_NAMES = ["O'Brien","Walsh","Fitzpatrick","Power","Kavanagh","Doyle","Hickey","Murphy","Whelan","Flynn","Kennedy","Sullivan","Byrne","Quinn","Connolly","Reilly","Foley","Nolan","Sheehan","Hearn"];

const PROPERTY_TYPES = ["Single Family", "Multi-Family", "Commercial"];

/* ------- Helpers ------- */
function seededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
const rand = seededRandom(42);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function pickN(arr, n) { return Array.from({length:n}, () => pick(arr)); }
function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
}
function fmt(n) { return "$" + n.toLocaleString('en-CA'); }
function fmtCompact(n) {
  if (n >= 1_000_000) return "$" + (n/1_000_000).toFixed(1) + "M";
  if (n >= 1000) return "$" + (n/1000).toFixed(1) + "k";
  return "$" + n;
}

/* ------- People ------- */
function genPerson(id, role) {
  const first = FIRST_NAMES[Math.floor(rand()*FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(rand()*LAST_NAMES.length)];
  const name = `${first} ${last}`;
  return {
    id,
    name,
    role,
    initials: initials(name),
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/'/g,"")}@example.com`,
    phone: `709-${200 + Math.floor(rand()*700)}-${Math.floor(1000+rand()*8999)}`,
    since: 2018 + Math.floor(rand()*7)
  };
}

const CLIENTS = Array.from({length:14}, (_, i) => genPerson(`c${i+1}`, "Client"));
const TENANTS = Array.from({length:26}, (_, i) => genPerson(`t${i+1}`, "Tenant"));
const VENDORS = Array.from({length:10}, (_, i) => genPerson(`v${i+1}`, "Vendor"));
VENDORS.forEach((v, i) => {
  v.company = ["Avalon Plumbing","East Coast Electric","Signal Hill HVAC","Northern Lights Cleaning","Harbour Landscaping","Rock Solid Roofing","Top Shelf Painting","Torbay Glass","Atlantic Pest Co","Downtown Locksmith"][i];
  v.trade = ["Plumbing","Electrical","HVAC","Cleaning","Landscaping","Roofing","Painting","Glazing","Pest Control","Locksmith"][i];
  v.rating = (4.3 + rand()*0.7).toFixed(1);
});

/* ------- Properties ------- */
const PROPERTY_NAMES = [
  "Gower Heights", "Duckworth Terrace", "Signal Row", "Harbour Point",
  "Battery Heights", "The Jellybean", "Quidi Vidi Flats", "Churchill Mews",
  "Rabbittown Row", "Waterford Hall", "Kings Bridge Lofts", "Elizabeth Park",
  "Forest Road Suites", "Topsail Commons", "LeMarchant Quarter", "Circular Estate",
  "Pleasantville Green", "Monkstown Mews", "Prince Wales Terrace", "Bond Street Block",
  "Rennies Mill Row", "Georgestown Gables", "New Gower Offices", "Torbay Plaza",
  "Kenmount Yards", "Cowan Heights Townhomes", "Water Street Warehouse", "Bell Island House"
];

const PROPERTIES = PROPERTY_NAMES.map((name, i) => {
  const type = i < 14 ? "Single Family" : i < 24 ? "Multi-Family" : "Commercial";
  const streetNum = 10 + Math.floor(rand()*280);
  const street = NL_STREETS[i % NL_STREETS.length];
  const units = type === "Single Family" ? 1 : type === "Multi-Family" ? 3 + Math.floor(rand()*9) : 1 + Math.floor(rand()*4);
  const beds = type === "Commercial" ? 0 : 1 + Math.floor(rand()*4);
  const baths = type === "Commercial" ? 1 + Math.floor(rand()*3) : 1 + Math.floor(rand()*3);
  const sqft = type === "Commercial" ? 1500 + Math.floor(rand()*8000) : 800 + Math.floor(rand()*2400);
  const rent = type === "Commercial"
    ? 2200 + Math.floor(rand()*7800)
    : type === "Multi-Family"
      ? 1800 + Math.floor(rand()*1600)
      : 1600 + Math.floor(rand()*2000);
  const occupancy = type === "Commercial"
    ? (rand() > 0.3 ? "Occupied" : "Vacant")
    : type === "Multi-Family"
      ? `${Math.floor(units*0.6 + rand()*(units*0.4))}/${units}`
      : (rand() > 0.25 ? "Occupied" : "Vacant");
  return {
    id: `p${i+1}`,
    name,
    type,
    address: `${streetNum} ${street}`,
    neighbourhood: NEIGHBOURHOODS[i % NEIGHBOURHOODS.length],
    city: "St. John's, NL",
    units,
    beds, baths, sqft,
    rent,
    occupancy,
    ownerId: CLIENTS[i % CLIENTS.length].id,
    listed: rand() > 0.55,
    listedRent: rent,
    yearBuilt: 1890 + Math.floor(rand()*130),
    mx: (rand()*100) | 0, // map x %
    my: (rand()*100) | 0, // map y %
    rating: (4.5 + rand()*0.5).toFixed(2),
    photoSeed: i,
  };
});

/* Pin positions — scatter around a simulated St. John's harbour layout */
PROPERTIES.forEach((p, i) => {
  // clustered distribution
  const angle = (i * 2.399) % (Math.PI*2);
  const r = 15 + (i % 5) * 12 + rand()*8;
  p.mx = 52 + Math.cos(angle) * r;
  p.my = 45 + Math.sin(angle) * r * 0.9;
});

/* ------- Portfolios (digital client agreements) ------- */
/* Fees stored as percentages. Leasing 0-100, LTM 5-12, STM 15-25. */
const PORTFOLIOS = [
  { id: "pf1", name: "Harbour Holdings", ownerIds: ["c1","c2"], propertyIds: ["p1","p5","p11","p15","p22"],
    fees: { leasing: 50, ltm: 8, stm: 20 }, signed: "2024-06-14", term: "2-year" },
  { id: "pf2", name: "Signal Hill Capital", ownerIds: ["c3"], propertyIds: ["p2","p7","p14"],
    fees: { leasing: 100, ltm: 10, stm: 22 }, signed: "2025-01-02", term: "1-year" },
  { id: "pf3", name: "East End Partners", ownerIds: ["c4","c5","c6"], propertyIds: ["p8","p9","p17","p23","p28"],
    fees: { leasing: 75, ltm: 9, stm: 18 }, signed: "2023-09-20", term: "3-year" },
  { id: "pf4", name: "Waterford Group", ownerIds: ["c7"], propertyIds: ["p10","p18"],
    fees: { leasing: 0, ltm: 6, stm: 15 }, signed: "2025-03-11", term: "1-year" },
  { id: "pf5", name: "Churchill Sq. Trust", ownerIds: ["c8","c9"], propertyIds: ["p4","p12","p19","p25"],
    fees: { leasing: 50, ltm: 7, stm: 20 }, signed: "2024-11-05", term: "2-year" },
  { id: "pf6", name: "Avalon Commercial", ownerIds: ["c10","c11"], propertyIds: ["p25","p26","p27"],
    fees: { leasing: 100, ltm: 12, stm: 25 }, signed: "2024-02-28", term: "5-year" },
];

/* ------- Leases ------- */
const LEASES = TENANTS.slice(0, 22).map((t, i) => {
  const p = PROPERTIES[i % PROPERTIES.length];
  const start = new Date(2023 + Math.floor(rand()*2), Math.floor(rand()*12), 1 + Math.floor(rand()*28));
  const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  const status = rand() < 0.08 ? "Ending soon" : rand() < 0.05 ? "Renewal sent" : "Active";
  return {
    id: `l${i+1}`,
    tenantId: t.id,
    propertyId: p.id,
    rent: p.rent,
    start: start.toISOString().slice(0,10),
    end: end.toISOString().slice(0,10),
    status,
    balance: rand() < 0.18 ? Math.floor(rand()*p.rent) : 0,
  };
});

/* ------- Payments ------- */
const PAYMENT_MONTHS = ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026"];
const PAYMENTS = [];
LEASES.forEach((l, li) => {
  PAYMENT_MONTHS.forEach((m, mi) => {
    const miss = rand() < 0.04;
    PAYMENTS.push({
      id: `pay-${li}-${mi}`,
      leaseId: l.id,
      tenantId: l.tenantId,
      propertyId: l.propertyId,
      month: m,
      amount: l.rent,
      status: mi === PAYMENT_MONTHS.length-1 ? (miss ? "Overdue" : rand() < 0.15 ? "Pending" : "Paid") : (miss ? "Late" : "Paid"),
      date: `2026-04-0${1 + Math.floor(rand()*9)}`,
    });
  });
});

/* ------- Projects (maintenance + capex) ------- */
const PROJECT_TITLES = [
  "Roof inspection & patch", "Furnace replacement", "Kitchen refresh — unit 2B",
  "Exterior paint touch-ups", "Driveway sealcoat", "Annual fire inspection",
  "Hot water tank swap", "Leaky faucet — bathroom", "Storm windows install",
  "Basement mold remediation", "New deck — rear yard", "Common area lighting",
  "Emergency: burst pipe", "Carpet replacement — hallway", "Boiler service",
  "Landscaping — spring cleanup", "Pest control — routine", "Garage door motor",
];

const PROJECTS = PROJECT_TITLES.map((title, i) => {
  const p = PROPERTIES[i % PROPERTIES.length];
  const v = VENDORS[i % VENDORS.length];
  const statuses = ["Requested","Scheduled","In progress","In progress","On hold","Completed","Completed"];
  const status = statuses[i % statuses.length];
  const priorities = ["Low","Medium","High","Urgent"];
  const isLarge = i < 4; // first four are large renovations w/ sub-projects
  const budget = isLarge ? 40000 + Math.floor(rand()*80000) : 300 + Math.floor(rand()*8000);
  const spent = Math.floor(budget * (0.2 + rand()*0.6));
  const markup = isLarge ? 15 + Math.floor(rand()*15) : 5 + Math.floor(rand()*10); // 5-30%
  const startMonth = 3 + (i % 4);
  const startDay = 1 + (i*3 % 26);
  const durDays = isLarge ? 45 + Math.floor(rand()*60) : 2 + Math.floor(rand()*14);
  const start = new Date(2026, startMonth - 1, startDay);
  const end = new Date(start); end.setDate(start.getDate() + durDays);
  return {
    id: `pr${i+1}`,
    title,
    propertyId: p.id,
    vendorId: v.id,
    status,
    priority: priorities[Math.floor(rand()*priorities.length)],
    budget,
    spent,
    markup,
    isLarge,
    start: start.toISOString().slice(0,10),
    end: end.toISOString().slice(0,10),
    due: end.toISOString().slice(0,10),
    created: `2026-0${Math.max(1, startMonth - 1)}-${String(1 + (i%28)).padStart(2,'0')}`,
    progress: status === 'Completed' ? 100 : status === 'In progress' ? 30 + Math.floor(rand()*50) : status === 'Scheduled' ? 5 : status === 'On hold' ? 40 : 0,
  };
});

/* Sub-projects for large renovations */
const SUBPROJECTS = [];
[
  { parent: 'pr1', items: ['Demo & tear-out', 'Framing & structure', 'Plumbing rough-in', 'Electrical rough-in', 'Drywall & paint', 'Finishes & punch list'] },
  { parent: 'pr2', items: ['Asbestos abatement', 'HVAC swap', 'Ductwork refresh', 'Commissioning'] },
  { parent: 'pr3', items: ['Cabinet demo', 'Plumbing relocation', 'New cabinets install', 'Countertops & backsplash', 'Appliances'] },
  { parent: 'pr4', items: ['Pressure wash', 'Caulk & prep', 'Primer coat', 'Final coat', 'Touch-ups'] },
].forEach(g => {
  const parent = PROJECTS.find(p => p.id === g.parent);
  if (!parent) return;
  const perBudget = Math.floor(parent.budget / g.items.length);
  const parentStart = new Date(parent.start);
  g.items.forEach((title, i) => {
    const st = new Date(parentStart); st.setDate(st.getDate() + i * 12);
    const en = new Date(st); en.setDate(en.getDate() + 10 + Math.floor(rand()*6));
    const statuses = ['Completed','Completed','In progress','Scheduled','Scheduled','Requested'];
    const status = i < statuses.length ? statuses[i] : 'Scheduled';
    SUBPROJECTS.push({
      id: `${g.parent}-s${i+1}`,
      parentId: g.parent,
      title,
      status,
      budget: perBudget,
      spent: status === 'Completed' ? perBudget * (0.85 + rand()*0.2) | 0 : status === 'In progress' ? perBudget * (0.3 + rand()*0.4) | 0 : 0,
      start: st.toISOString().slice(0,10),
      end: en.toISOString().slice(0,10),
      vendorId: VENDORS[(i+1) % VENDORS.length].id,
      progress: status === 'Completed' ? 100 : status === 'In progress' ? 50 : 0,
    });
  });
});

/* Expenses tied to projects — account-coded */
const EXPENSE_ACCOUNTS = ['Labour','Materials','Permits','Subcontractor','Equipment','Disposal'];
const EXPENSES = [];
PROJECTS.forEach((pr, pi) => {
  const count = pr.isLarge ? 8 + Math.floor(rand()*10) : 1 + Math.floor(rand()*3);
  for (let i = 0; i < count; i++) {
    const amt = pr.isLarge ? 400 + Math.floor(rand()*6000) : 80 + Math.floor(rand()*600);
    EXPENSES.push({
      id: `ex-${pr.id}-${i}`,
      projectId: pr.id,
      subId: null,
      account: EXPENSE_ACCOUNTS[Math.floor(rand()*EXPENSE_ACCOUNTS.length)],
      vendorId: VENDORS[Math.floor(rand()*VENDORS.length)].id,
      description: ['Invoice','Receipt','PO','Hardware run','Site visit','Delivery'][Math.floor(rand()*6)] + ' #' + (1000 + Math.floor(rand()*8999)),
      amount: amt,
      markup: pr.markup,
      billed: amt * (1 + pr.markup/100),
      date: `2026-0${Math.max(1, 3 + (i%3))}-${String(1 + (i*5)%28).padStart(2,'0')}`,
      status: rand() < 0.7 ? 'Billed' : rand() < 0.6 ? 'Approved' : 'Pending',
    });
  }
});

/* ------- Activity feed ------- */
const ACTIVITY = [
  { type: "pay", color: "#1f9d55", text: "Payment received from Maeve Walsh — Gower Heights", time: "2m" },
  { type: "req", color: "#F5C518", text: "New viewing request for 42 Duckworth St (Battery Heights)", time: "18m" },
  { type: "proj", color: "#2b6fd6", text: "Avalon Plumbing marked 'Emergency: burst pipe' in progress", time: "47m" },
  { type: "lease", color: "#6b665f", text: "Lease renewal sent to Siobhan O'Brien — 12-month term", time: "1h" },
  { type: "pay", color: "#d14343", text: "Payment overdue — Conor Doyle (Waterford Hall)", time: "3h" },
  { type: "proj", color: "#1f9d55", text: "Roof inspection completed at Harbour Point — no issues", time: "4h" },
  { type: "req", color: "#F5C518", text: "New tenant application — Liam Fitzpatrick", time: "6h" },
  { type: "proj", color: "#2b6fd6", text: "Rock Solid Roofing scheduled for Bond Street Block", time: "yesterday" },
  { type: "lease", color: "#6b665f", text: "Lease signed — Ciara Power (The Jellybean, unit 3)", time: "yesterday" },
  { type: "pay", color: "#1f9d55", text: "8 rent payments auto-collected for April", time: "2d" },
];

/* Helper lookups */
function getProperty(id) { return PROPERTIES.find(p => p.id === id); }
function getTenant(id) { return TENANTS.find(t => t.id === id); }
function getClient(id) { return CLIENTS.find(c => c.id === id); }
function getVendor(id) { return VENDORS.find(v => v.id === id); }

/* Expose globally */
Object.assign(window, {
  CLIENTS, TENANTS, VENDORS, PROPERTIES, PORTFOLIOS, LEASES, PAYMENTS, PROJECTS,
  SUBPROJECTS, EXPENSES, EXPENSE_ACCOUNTS,
  ACTIVITY, NEIGHBOURHOODS, PROPERTY_TYPES,
  getProperty, getTenant, getClient, getVendor,
  fmt, fmtCompact, initials
});
