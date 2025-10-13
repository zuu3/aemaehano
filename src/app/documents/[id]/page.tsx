'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { Badge } from '@/components/ui/Badge';
import ScoreGauge from '@/components/ui/ScoreGauge';
import HighlightText from '@/components/ui/HighlightText';
import { useDocument, useDeleteDocument } from '@/hooks/useDocuments';
import type { AnalysisResult } from '@/types';

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  text-shadow: 0 0 40px rgba(122, 165, 255, 0.15);
  flex: 1;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const MainPanel = styled(GlassPanel)`
  max-width: 900px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const DocumentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.glass.stroke};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MetaLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CategoriesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ResultsSection = styled.div`
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

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.text.secondary};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.glass.stroke};
`;

const CATEGORY_LABELS: Record<string, string> = {
  hedge: '불확실',
  vague: '모호',
  softener: '완곡',
  apology: '과도한 사과',
  filler: '불필요한 표현',
};

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: document, isLoading, error } = useDocument(id);
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument();

  const handleDelete = () => {
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      deleteDoc(id, {
        onSuccess: () => {
          router.push('/documents');
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container>
        <MainPanel elevation="high" glow>
          <LoadingState>문서를 불러오는 중...</LoadingState>
        </MainPanel>
      </Container>
    );
  }

  if (error || !document) {
    return (
      <Container>
        <MainPanel elevation="high" glow>
          <ErrorMessage>
            <strong>오류:</strong> {error?.message || '문서를 찾을 수 없습니다.'}
          </ErrorMessage>
          <ActionsRow>
            <GlassButton onClick={() => router.push('/documents')}>
              목록으로 돌아가기
            </GlassButton>
          </ActionsRow>
        </MainPanel>
      </Container>
    );
  }

  // Convert document to AnalysisResult format for HighlightText component
  const analysisResult: AnalysisResult = {
    original_text: document.original_text,
    ambiguity_score: document.ambiguity_score,
    highlights: document.highlights,
    categories: document.categories,
    suggestions: document.suggestions,
  };

  return (
    <Container>
      <Header>
        <GlassButton variant="ghost" onClick={() => router.push('/documents')}>
          ← 목록
        </GlassButton>
        <Title>{document.title}</Title>
        <div style={{ width: '80px' }} /> {/* Spacer for alignment */}
      </Header>

      <MainPanel elevation="high" glow>
        <DocumentMeta>
          <MetaRow>
            <MetaLabel>생성일</MetaLabel>
            <MetaValue>{formatDate(document.created_at)}</MetaValue>
          </MetaRow>
          
          {document.categories.length > 0 && (
            <div>
              <MetaLabel style={{ marginBottom: '8px', display: 'block' }}>
                발견된 문제 유형
              </MetaLabel>
              <CategoriesRow>
                {document.categories.map((cat) => (
                  <Badge key={cat} variant="info" size="sm">
                    {CATEGORY_LABELS[cat] || cat}
                  </Badge>
                ))}
              </CategoriesRow>
            </div>
          )}
        </DocumentMeta>

        <ResultsSection>
          <ScoreSection>
            <ScoreGauge score={document.ambiguity_score} />
          </ScoreSection>

          <HighlightsSection>
            <SectionTitle>분석 결과</SectionTitle>
            <HighlightText result={analysisResult} />
          </HighlightsSection>
        </ResultsSection>

        <ActionsRow>
          <GlassButton
            fullWidth
            onClick={() => router.push('/documents')}
          >
            목록으로
          </GlassButton>
          <GlassButton
            variant="ghost"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </GlassButton>
        </ActionsRow>
      </MainPanel>
    </Container>
  );
}
