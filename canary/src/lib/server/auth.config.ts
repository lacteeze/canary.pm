/**
 * Static auth config for the better-auth CLI only.
 * At runtime, use createAuth(env) from ./auth.ts instead.
 *
 * Regenerate schema:
 *   npx @better-auth/cli generate --config ./src/server/auth.config.ts --output ./src/server/db/schema/auth.schema.ts --yes
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization, twoFactor, phoneNumber } from 'better-auth/plugins';

export const auth = betterAuth({
  appName: 'Canary',
  database: drizzleAdapter({} as any, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: 'placeholder',
      clientSecret: 'placeholder',
    },
  },
  plugins: [
    organization(),
    twoFactor(),
    phoneNumber({
      sendOTP: async () => {},
    }),
  ],
});
