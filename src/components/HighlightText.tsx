'use client';

import styled from '@emotion/styled';
import type { Hit } from '@/types';

type Props = { text: string; hits: Hit[] };

const COLORS: Record<Hit['cat'], string> = {
  hedge: '#ff6b81',
  vague: '#ffb86b',
  softener: '#7aa5ff',
  apology: '#9aa3b2',
  filler: '#4cd4a4',
};

const Chip = styled.mark<{ cat: Hit['cat'] }>`
  background: ${({ cat }) => (COLORS[cat] || '#6b8cff')}33;
  border-bottom: 2px solid ${({ cat }) => COLORS[cat] || '#6b8cff'};
  padding: 0 2px;
  border-radius: 2px;
`;

export default function HighlightText({ text, hits }: Props) {
  if (!hits?.length) return <>{text}</>;

  const segments: React.ReactNode[] = [];
  let cur = 0;

  [...hits].sort((a, b) => a.start - b.start).forEach((h) => {
    if (h.start > cur) segments.push(text.slice(cur, h.start));
    segments.push(
      <Chip key={`${h.start}-${h.end}`} cat={h.cat}>
        {text.slice(h.start, h.end)}
      </Chip>,
    );
    cur = h.end;
  });
  if (cur < text.length) segments.push(text.slice(cur));

  return <>{segments}</>;
}
