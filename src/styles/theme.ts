import { Theme } from '@emotion/react';

export const theme: Theme = {
  colors: {
    bg: '#0f1221',
    panel: '#151a2f',
    text: '#e6e8f0',
    subtext: '#aab0c0',
    accent: '#6b8cff',
    danger: '#ff6b81',
    warning: '#ffb86b',
    success: '#4cd4a4',
  },
  radius: '16px',
} as const;

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      bg: string;
      panel: string;
      text: string;
      subtext: string;
      accent: string;
      danger: string;
      warning: string;
      success: string;
    };
    radius: string;
  }
}
