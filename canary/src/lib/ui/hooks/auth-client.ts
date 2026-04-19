import { createAuthClient } from 'better-auth/react';
import {
  organizationClient,
  twoFactorClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/login?2fa=true';
      },
    }),
    phoneNumberClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
