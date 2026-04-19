import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization, twoFactor, phoneNumber } from 'better-auth/plugins';
import { createDb } from './db';
import * as schema from './db/schema';

export function createAuth(env: Env) {
  const db = createDb(env.DB);

  return betterAuth({
    appName: 'Canary',
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [
      organization(),
      twoFactor(),
      phoneNumber({
        sendOTP: async ({ phoneNumber: phone, code }, _ctx) => {
          // TODO: wire up Twilio / SMS provider
          if (env.ENVIRONMENT !== 'production') {
            console.log(`[DEV] OTP for ${phone}: ${code}`);
          }
        },
      }),
    ],
  });
}
