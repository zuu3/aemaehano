import '@emotion/react';

export type ColorMode = 'light' | 'dark';

const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#7aa5ff',
  
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
};

const darkGlass = {
  surface: {
    base: 'rgba(18, 18, 18, 0.88)',
    elevated: 'rgba(28, 28, 30, 0.92)',
    overlay: 'rgba(44, 44, 46, 0.96)',
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.06)',
    bgAlt: 'rgba(255, 255, 255, 0.03)',
    bgHover: 'rgba(255, 255, 255, 0.09)',
    bgActive: 'rgba(255, 255, 255, 0.12)',
    stroke: 'rgba(255, 255, 255, 0.18)',
    strokeAlt: 'rgba(255, 255, 255, 0.12)',
    highlight: 'rgba(255, 255, 255, 0.35)',
    highlightSoft: 'rgba(255, 255, 255, 0.15)',
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.95)',
    secondary: 'rgba(255, 255, 255, 0.70)',
    tertiary: 'rgba(255, 255, 255, 0.50)',
    disabled: 'rgba(255, 255, 255, 0.35)',
  },
  glow: {
    primary: 'radial-gradient(120% 120% at 20% 10%, rgba(122, 165, 255, 0.20) 0%, rgba(122, 165, 255, 0) 60%)',
    accent: 'radial-gradient(140% 140% at 50% 0%, rgba(122, 165, 255, 0.15) 0%, rgba(122, 165, 255, 0) 70%)',
    success: 'radial-gradient(120% 120% at 20% 10%, rgba(52, 199, 89, 0.18) 0%, rgba(52, 199, 89, 0) 60%)',
    danger: 'radial-gradient(120% 120% at 20% 10%, rgba(255, 59, 48, 0.18) 0%, rgba(255, 59, 48, 0) 60%)',
  },
  background: {
    base: '#000000',
    gradient: 'radial-gradient(ellipse at top, rgba(10, 10, 15, 1) 0%, rgba(0, 0, 0, 1) 60%)',
    noise: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
  },
};

const lightGlass = {
  surface: {
    base: 'rgba(255, 255, 255, 0.88)',
    elevated: 'rgba(250, 250, 252, 0.92)',
    overlay: 'rgba(242, 242, 247, 0.96)',
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.65)',
    bgAlt: 'rgba(255, 255, 255, 0.45)',
    bgHover: 'rgba(255, 255, 255, 0.75)',
    bgActive: 'rgba(255, 255, 255, 0.85)',
    stroke: 'rgba(0, 0, 0, 0.12)',
    strokeAlt: 'rgba(0, 0, 0, 0.08)',
    highlight: 'rgba(255, 255, 255, 0.95)',
    highlightSoft: 'rgba(255, 255, 255, 0.70)',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.90)',
    secondary: 'rgba(0, 0, 0, 0.65)',
    tertiary: 'rgba(0, 0, 0, 0.45)',
    disabled: 'rgba(0, 0, 0, 0.30)',
  },
  glow: {
    primary: 'radial-gradient(120% 120% at 20% 10%, rgba(0, 122, 255, 0.12) 0%, rgba(0, 122, 255, 0) 60%)',
    accent: 'radial-gradient(140% 140% at 50% 0%, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0) 70%)',
    success: 'radial-gradient(120% 120% at 20% 10%, rgba(52, 199, 89, 0.12) 0%, rgba(52, 199, 89, 0) 60%)',
    danger: 'radial-gradient(120% 120% at 20% 10%, rgba(255, 59, 48, 0.12) 0%, rgba(255, 59, 48, 0) 60%)',
  },
  background: {
    base: '#FFFFFF',
    gradient: 'radial-gradient(ellipse at top, rgba(245, 245, 250, 1) 0%, rgba(255, 255, 255, 1) 60%)',
    noise: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
  },
};

const effects = {
  blur: {
    sm: '6px',
    md: '10px',
    lg: '18px',
    xl: '24px',
  },
  shadow: {
    sm: '0 8px 20px rgba(0, 0, 0, 0.25)',
    md: '0 16px 40px rgba(0, 0, 0, 0.35)',
    lg: '0 24px 60px rgba(0, 0, 0, 0.45)',
    inner: 'inset 0 1px 3px rgba(0, 0, 0, 0.15)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
  ring: {
    width: '2px',
    offset: '2px',
    color: 'rgba(122, 165, 255, 0.6)',
  },
};

const motion = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Cascadia Code", "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
  },
};

// Spacing
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const createTheme = (mode: ColorMode = 'dark') => ({
  mode,
  colors,
  ...(mode === 'dark' ? darkGlass : lightGlass),
  effects,
  motion,
  typography,
  spacing,
  breakpoints,
});

export type Theme = ReturnType<typeof createTheme>;

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends ReturnType<typeof createTheme> {}
}

export default createTheme('dark');