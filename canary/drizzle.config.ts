import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .dev.vars so process.env has our local secrets
config({ path: '.dev.vars' });

export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/server/db/schema/index.ts',
  dialect: 'sqlite',
});
