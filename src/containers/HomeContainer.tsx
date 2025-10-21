'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassTextarea } from '@/components/ui/GlassInput';
import ScoreGauge from '@/components/ui/ScoreGauge';
import HighlightText from '@/components/ui/HighlightText';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import TextStatsDisplay from '@/components/ui/TextStatsDisplay';
import ModeSelector from '@/components/ui/ModeSelector';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useCreateDocument } from '@/hooks/useDocuments';
import { useDebounce } from '@/hooks/useDebounce';
import { calculateTextStats } from '@/utils/textStats';
import type { AnalysisMode } from '@/types';

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

const RealtimeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.md};
`;

const ToggleLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ToggleSwitch = styled.button<{ isActive: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: ${({ theme }) => theme.effects.radius.full};
  background: ${({ theme, isActive }) =>
    isActive ? theme.colors.accent : theme.glass.bgAlt};
  border: 2px solid ${({ theme, isActive }) =>
    isActive ? theme.colors.accent : theme.glass.stroke};
  position: relative;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast} 
    ${({ theme }) => theme.motion.easing.easeOut};
  
  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.text.primary};
    top: 2px;
    left: ${({ isActive }) => isActive ? '26px' : '2px'};
    transition: left ${({ theme }) => theme.motion.duration.fast} 
      ${({ theme }) => theme.motion.easing.easeOut};
  }
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
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

const ImprovedTextBox = styled.div`
  background: ${({ theme }) => theme.glass.bgAlt};
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.glow.primary};
    opacity: 0.3;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const ImprovedTextLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const ImprovedTextContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.text.primary};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bg};
  border-radius: ${({ theme }) => theme.effects.radius.md};
  border: 1px solid ${({ theme }) => theme.glass.stroke};
`;

const HomeContainer = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true);
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('business');
  const { mutate: analyze, data, isPending, error } = useAnalyze();
  const { mutate: saveDocument, isPending: isSaving, error: saveError } = useCreateDocument();

  // 실시간 분석을 위한 debounced 텍스트
  const debouncedText = useDebounce(text, 1500);

  // 실시간 분석 활성화 시 debounced 텍스트가 변경되면 자동 분석
  useEffect(() => {
    if (isRealtimeEnabled && debouncedText.trim().length > 10) {
      analyze({ text: debouncedText, mode: selectedMode });
    }
  }, [debouncedText, isRealtimeEnabled, selectedMode, analyze]);

  // Ctrl+S 키보드 단축키로 문서 저장
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S (Windows/Linux) 또는 Cmd+S (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // 브라우저 기본 저장 동작 방지

        if (data && !isSaving) {
          handleSaveDocument();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, isSaving]); // handleSaveDocument는 아래에서 정의됨

  if (data) {
    console.log('=== 분석 결과 ===');
    console.log('점수:', data.ambiguity_score);
    console.log('발견된 문제 수:', data.highlights?.length || 0);
    console.log('카테고리:', data.categories);
    console.log('개선된 텍스트:', data.improved_text);
    console.log('전체 데이터:', data);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      analyze({ text, mode: selectedMode });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleApplyImprovedText = () => {
    if (data?.improved_text) {
      setText(data.improved_text);
      // 개선된 텍스트로 다시 분석
      analyze({ text: data.improved_text, mode: selectedMode });
    }
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
        analysis_mode: selectedMode, // 선택된 모드 저장
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
          {/* 분석 모드 선택 */}
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
          />

          <RealtimeToggleContainer>
            <ToggleLabel>
              ⚡ 실시간 분석
              {isRealtimeEnabled && isPending && ' (분석 중...)'}
            </ToggleLabel>
            <ToggleSwitch
              isActive={isRealtimeEnabled}
              onClick={() => setIsRealtimeEnabled(!isRealtimeEnabled)}
              aria-label={isRealtimeEnabled ? '실시간 분석 비활성화' : '실시간 분석 활성화'}
              title={isRealtimeEnabled
                ? '타이핑 중단 후 1.5초 뒤 자동 분석'
                : '수동 분석 모드'}
            />
          </RealtimeToggleContainer>

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

          {!isRealtimeEnabled && (
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
          )}

          {error && (
            <ErrorMessage role="alert">
              <strong>오류:</strong> {error.message || '분석 중 오류가 발생했습니다.'}
            </ErrorMessage>
          )}
        </FormSection>

        {isPending && <LoadingAnimation />}

        {data && !isPending && (
          <ResultsSection>
            <ScoreSection>
              <ScoreGauge score={data.ambiguity_score} />
            </ScoreSection>

            <HighlightsSection>
              <SectionTitle>📊 텍스트 통계</SectionTitle>
              <TextStatsDisplay stats={calculateTextStats(data.original_text)} />
            </HighlightsSection>

            <HighlightsSection>
              <SectionTitle>분석 결과</SectionTitle>
              <HighlightText result={data} />
            </HighlightsSection>

            {data.improved_text && data.highlights.length > 0 && (
              <HighlightsSection>
                <SectionTitle>✨ AI 개선 제안</SectionTitle>
                <ImprovedTextBox>
                  <ImprovedTextLabel>개선된 텍스트:</ImprovedTextLabel>
                  <ImprovedTextContent>{data.improved_text}</ImprovedTextContent>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={handleApplyImprovedText}
                    aria-label="개선된 텍스트 적용"
                  >
                    이 텍스트로 바꾸기
                  </GlassButton>
                </ImprovedTextBox>
              </HighlightsSection>
            )}

            <SaveSection>
              <Label htmlFor="document-title">
                문서 제목 (선택사항)
                <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '8px' }}>
                  💡 Ctrl+S로 빠른 저장
                </span>
              </Label>
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
                title="단축키: Ctrl+S 또는 Cmd+S"
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