'use client';

import styled from '@emotion/styled';

const Wrap = styled.div`
  display: flex; align-items: center; gap: 12px;
`;
const Ring = styled.div<{ score: number }>`
  --d: ${({ score }) => Math.round(Math.max(0, Math.min(100, score)))};
  width: 74px; height: 74px; border-radius: 50%;
  background:
    conic-gradient(#6b8cff var(--d)%, #222b4a var(--d)% 100%),
    radial-gradient(#0f1221 55%, transparent 56%);
  display: grid; place-items: center; font-weight: 800;
`;
const Box = styled.div`font-size: 14px; opacity: 0.9;`;

export default function ScoreGauge({
  score, breakdown,
}: { score: number; breakdown: { catPenalty: number; patternPenalty: number; densityPenalty: number; bonus: number } }) {
  const penalty = (breakdown.catPenalty + breakdown.patternPenalty + breakdown.densityPenalty).toFixed(1);
  return (
    <Wrap>
      <Ring score={score}><div>{Math.round(score)}</div></Ring>
      <Box>
        <div>Penalty: {penalty}</div>
        <div>Bonus: {breakdown.bonus}</div>
      </Box>
    </Wrap>
  );
}
