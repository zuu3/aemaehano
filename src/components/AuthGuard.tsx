'use client';

import { useSession, signIn } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') signIn(undefined, { callbackUrl: '/' });
  }, [status]);
  if (status !== 'authenticated') return null;
  return <>{children}</>;
}
