'use client';

import { Global, css } from '@emotion/react';

export default function GlobalStyles() {
  return (
    <Global
      styles={css`
        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          background: #0f1221;
          color: #e6e8f0;
          font-family: ui-sans-serif, system-ui, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR',
            Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
        }
        ::selection { background: #6b8cff55; }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; }
      `}
    />
  );
}
