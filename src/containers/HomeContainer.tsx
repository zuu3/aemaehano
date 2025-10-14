'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassTextarea } from '@/components/ui/GlassInput';
import ScoreGauge from '@/components/ui/ScoreGauge';
import HighlightText from '@/components/ui/HighlightText';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useCreateDocument } from '@/hooks/useDocuments';

const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  }
`;

const Header = styled.header`
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  
  /* Subtle text glow */
  text-shadow: 0 0 40px rgba(122, 165, 255, 0.15);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const MainPanel = styled(GlassPanel)`
  max-width: 900px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ResultsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ScoreSection = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const HighlightsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SaveSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.glass.stroke};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.colors.success}40;
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  /* Success glow */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.glow.success};
    opacity: 0.5;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  /* Danger glow */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.glow.danger};
    opacity: 0.5;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const HomeContainer = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { mutate: analyze, data, isPending, error } = useAnalyze();
  const { mutate: saveDocument, isPending: isSaving, error: saveError } = useCreateDocument();

  if (data) {
    console.log('=== 분석 결과 ===');
    console.log('점수:', data.ambiguity_score);
    console.log('발견된 문제 수:', data.highlights?.length || 0);
    console.log('카테고리:', data.categories);
    console.log('전체 데이터:', data);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      analyze({ text });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSaveDocument = () => {
    if (!data) return;

    const documentTitle = title.trim() || text.substring(0, 50) + (text.length > 50 ? '...' : '');

    saveDocument(
      {
        title: documentTitle,
        original_text: data.original_text,
        ambiguity_score: data.ambiguity_score,
        highlights: data.highlights,
        categories: data.categories,
        suggestions: data.suggestions,
      },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        },
      }
    );
  };

  return (
    <Container>
      <Header>
        <Title>애매한 텍스트 분석기</Title>
        <Subtitle>
          텍스트의 모호성을 AI가 분석하고 개선 방향을 제시합니다
        </Subtitle>
      </Header>

      <MainPanel elevation="high" glow>
        <FormSection>
          <div>
            <Label htmlFor="text-input">분석할 텍스트 입력</Label>
            <GlassTextarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder="분석하고 싶은 텍스트를 입력하세요..."
              rows={6}
              disabled={isPending}
              aria-label="분석할 텍스트 입력"
            />
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={!text.trim() || isPending}
            loading={isPending}
            aria-label={isPending ? '분석 중' : '분석 시작'}
          >
            {isPending ? '분석 중...' : '분석 시작'}
          </GlassButton>

          {error && (
            <ErrorMessage role="alert">
              <strong>오류:</strong> {error.message || '분석 중 오류가 발생했습니다.'}
            </ErrorMessage>
          )}
        </FormSection>

        {data && (
          <ResultsSection>
            <ScoreSection>
              <ScoreGauge score={data.ambiguity_score} />
            </ScoreSection>

            <HighlightsSection>
              <SectionTitle>분석 결과</SectionTitle>
              <HighlightText result={data} />
            </HighlightsSection>

            <SaveSection>
              <Label htmlFor="document-title">문서 제목 (선택사항)</Label>
              <GlassTextarea
                id="document-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하지 않으면 텍스트 앞부분이 자동으로 제목이 됩니다"
                rows={1}
                disabled={isSaving}
              />

              <GlassButton
                variant="primary"
                size="md"
                fullWidth
                onClick={handleSaveDocument}
                disabled={isSaving}
                loading={isSaving}
              >
                {isSaving ? '저장 중...' : '분석 결과 저장'}
              </GlassButton>

              {saveSuccess && (
                <SuccessMessage role="status">
                  ✓ 문서가 성공적으로 저장되었습니다!
                </SuccessMessage>
              )}

              {saveError && (
                <ErrorMessage role="alert">
                  <strong>저장 실패:</strong> {saveError.message || '문서 저장 중 오류가 발생했습니다.'}
                </ErrorMessage>
              )}
            </SaveSection>
          </ResultsSection>
        )}
      </MainPanel>
    </Container>
  );
};

export default HomeContainer;