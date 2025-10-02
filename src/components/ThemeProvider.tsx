'use client';

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import GlobalStyles from '@/styles/GlobalStyles';
import theme from '@/styles/theme';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <EmotionThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </EmotionThemeProvider>
  );
}