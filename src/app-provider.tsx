'use client';

import { ThemeProvider } from '@emotion/react';
import GlobalStyles from '@/styles/GlobalStyles';
import theme, { Theme } from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());

  return (
    <ThemeProvider theme={theme as Theme}>
      <GlobalStyles />
      <SessionProvider>
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
