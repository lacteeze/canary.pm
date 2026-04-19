import type { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useSession } from '@hooks/auth-client';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--ink-3)', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Redirect to="~/login" />;
  }

  return <>{children}</>;
}
