'use client';

import { CacheProvider, ThemeProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import GlobalStyles from '@/styles/GlobalStyles';
import theme, { Theme } from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

const cache = createCache({ key: 'cs', prepend: true });

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme as Theme}>
        <GlobalStyles />
        <SessionProvider>
          <QueryClientProvider client={qc}>{children}</QueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
