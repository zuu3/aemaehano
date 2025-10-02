// src/styles/GlobalStyles.tsx
import { Global, css, useTheme } from '@emotion/react';

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        /* CSS Reset & Base */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          font-family: ${theme.typography.fontFamily.base};
          font-size: ${theme.typography.fontSize.base};
          line-height: ${theme.typography.lineHeight.normal};
          color: ${theme.text.primary};
          background: ${theme.background.base};
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Background with gradient and noise */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme.background.gradient};
          z-index: -2;
        }

        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme.background.noise};
          pointer-events: none;
          z-index: -1;
          opacity: 1;
        }

        /* Selection */
        ::selection {
          background-color: ${theme.colors.accent};
          color: ${theme.text.primary};
          text-shadow: none;
        }

        ::-moz-selection {
          background-color: ${theme.colors.accent};
          color: ${theme.text.primary};
          text-shadow: none;
        }

        /* Focus styles - Accessibility */
        :focus-visible {
          outline: ${theme.effects.ring.width} solid ${theme.effects.ring.color};
          outline-offset: ${theme.effects.ring.offset};
          border-radius: ${theme.effects.radius.sm};
        }

        /* Remove default focus for mouse users */
        :focus:not(:focus-visible) {
          outline: none;
        }

        /* Scrollbar styling (webkit) */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.glass.bg};
          border-radius: ${theme.effects.radius.full};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.glass.stroke};
          border-radius: ${theme.effects.radius.full};
          backdrop-filter: blur(${theme.effects.blur.sm});
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.glass.bgHover};
        }

        /* Reduced motion support - Accessibility */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Button reset */
        button {
          border: none;
          background: none;
          font-family: inherit;
          cursor: pointer;
          
          &:disabled {
            cursor: not-allowed;
          }
        }

        /* Input reset */
        input,
        textarea,
        select {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          color: inherit;
        }

        /* Link reset */
        a {
          color: inherit;
          text-decoration: none;
        }

        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          font-weight: ${theme.typography.fontWeight.semibold};
          line-height: ${theme.typography.lineHeight.tight};
          letter-spacing: ${theme.typography.letterSpacing.tight};
        }

        /* Glass effect utilities - for debugging */
        .glass-debug {
          background: ${theme.glass.bg};
          backdrop-filter: blur(${theme.effects.blur.md});
          border: 1px solid ${theme.glass.stroke};
        }
      `}
    />
  );
};

export default GlobalStyles;