'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { useAnalyze } from '@/hooks/useAnalyze';
import HighlightText from '@/components/HighlightText';
import ScoreGauge from '@/components/ScoreGauge';
import UserMenu from '@/components/UserMenu';
import AuthGuard from '@/components/AuthGuard';

const Container = styled.div`max-width:1100px;margin:40px auto;padding:0 20px;`;
const TopBar = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;`;
const Grid = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:16px;
  @media (max-width:900px){ grid-template-columns:1fr; }
`;
const Panel = styled.div`background:#151a2f;padding:16px;border-radius:16px;`;
const TextArea = styled.textarea`
  width:100%;min-height:320px;background:#0e0f1a;color:#e6e8f0;border:1px solid #262a40;border-radius:12px;padding:12px;resize:vertical;line-height:1.6;
`;
const Button = styled.button`
  background:#6b8cff;color:#fff;border:none;padding:10px 14px;border-radius:12px;font-weight:700;
  &:disabled{opacity:.5;cursor:not-allowed;}
`;

export default function HomeContainer() {
  const [text, setText] = useState(
    '아마 이번 기능은 괜찮은 편인 것 같아요. 결론적으로 전환율이 23% 정도 늘어날 수도 있습니다.',
  );
  const analyze = useAnalyze();

  return (
    <AuthGuard>
      <Container>
        <TopBar>
          <h1>aemaehano</h1>
          <UserMenu />
        </TopBar>

        <Grid>
          <Panel>
            <h3>입력</h3>
            <TextArea value={text} onChange={(e) => setText(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button onClick={() => analyze.mutate({ text })} disabled={analyze.isPending}>
                {analyze.isPending ? '분석 중...' : '분석'}
              </Button>
            </div>
          </Panel>

          <Panel>
            <h3>결과</h3>
            {analyze.data ? (
              <>
                <ScoreGauge score={analyze.data.score} breakdown={analyze.data.breakdown} />
                <div style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>
                  카테고리 감점: {analyze.data.breakdown.catPenalty} / 패턴:{' '}
                  {analyze.data.breakdown.patternPenalty} / 밀도:{' '}
                  {analyze.data.breakdown.densityPenalty}
                </div>
                <div style={{ marginTop: 12, lineHeight: 1.9 }}>
                  <HighlightText text={text} hits={analyze.data.hits} />
                </div>
              </>
            ) : (
              <div style={{ opacity: 0.7 }}>왼쪽에 텍스트를 입력하고 "분석"을 누르세요.</div>
            )}
          </Panel>
        </Grid>
      </Container>
    </AuthGuard>
  );
}
