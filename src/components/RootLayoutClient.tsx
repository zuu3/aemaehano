'use client';

import AppProviders from '@/app-provider';
import ClientLayout from '@/components/ClientLayout';
import { ReactNode, useEffect, useState } from 'react';

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AppProviders>
      <ClientLayout>{children}</ClientLayout>
    </AppProviders>
  );
}
