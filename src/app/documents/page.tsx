'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { Badge } from '@/components/ui/Badge';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import type { Document } from '@/types';

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
  text-shadow: 0 0 40px rgba(122, 165, 255, 0.15);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const SearchSection = styled.div`
  max-width: 900px;
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MainPanel = styled(GlassPanel)`
  max-width: 1200px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DocumentCard = styled(GlassPanel)`
  cursor: pointer;
  transition: all 0.3s ease;
  padding: ${({ theme }) => theme.spacing.lg};
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary}80;
  }
`;

const DocumentTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DocumentPreview = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const DocumentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.glass.stroke};
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ScoreLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
`;

const ScoreValue = styled.span<{ score: number }>`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ score, theme }) =>
    score >= 80 ? theme.colors.success :
      score >= 60 ? theme.colors.primary :
        score >= 40 ? theme.colors.warning :
          theme.colors.danger
  };
`;

const CategoriesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DateRow = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.text.tertiary};
`;

const ActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.text.secondary};
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

const CATEGORY_LABELS: Record<string, string> = {
  hedge: '불확실',
  vague: '모호',
  softener: '완곡',
  apology: '과도한 사과',
  filler: '불필요한 표현',
};

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: documents, isLoading, error } = useDocuments(searchQuery);
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument();

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleDocumentClick = (id: string) => {
    router.push(`/documents/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      deleteDoc(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <Header>
        <Title>저장된 문서</Title>
      </Header>

      <SearchSection>
        <GlassInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="문서 검색..."
        />
        <GlassButton onClick={handleSearch}>검색</GlassButton>
        {searchQuery && (
          <GlassButton
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setSearchInput('');
            }}
          >
            초기화
          </GlassButton>
        )}
      </SearchSection>

      <MainPanel elevation="high" glow>
        {isLoading && <LoadingState>문서를 불러오는 중...</LoadingState>}

        {error && (
          <ErrorMessage>
            <strong>오류:</strong> {error.message || '문서를 불러오는 중 오류가 발생했습니다.'}
          </ErrorMessage>
        )}

        {documents && documents.length === 0 && (
          <EmptyState>
            {searchQuery ? '검색 결과가 없습니다.' : '저장된 문서가 없습니다.'}
          </EmptyState>
        )}

        {documents && documents.length > 0 && (
          <DocumentGrid>
            {documents.map((doc: Document) => (
              <DocumentCard
                key={doc.id}
                elevation="medium"
                onClick={() => handleDocumentClick(doc.id)}
              >
                <DocumentTitle>{doc.title}</DocumentTitle>
                <DocumentPreview>{doc.original_text}</DocumentPreview>

                <DocumentMeta>
                  <ScoreRow>
                    <ScoreLabel>설득력 점수</ScoreLabel>
                    <ScoreValue score={doc.ambiguity_score}>
                      {doc.ambiguity_score}점
                    </ScoreValue>
                  </ScoreRow>

                  {doc.categories.length > 0 && (
                    <CategoriesRow>
                      {doc.categories.slice(0, 3).map((cat) => (
                        <Badge key={cat} variant="info" size="sm">
                          {CATEGORY_LABELS[cat] || cat}
                        </Badge>
                      ))}
                      {doc.categories.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{doc.categories.length - 3}
                        </Badge>
                      )}
                    </CategoriesRow>
                  )}

                  <DateRow>{formatDate(doc.created_at)}</DateRow>
                </DocumentMeta>

                <ActionsRow>
                  <GlassButton
                    size="sm"
                    fullWidth
                    onClick={() => handleDocumentClick(doc.id)}
                  >
                    상세보기
                  </GlassButton>
                  <GlassButton
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDelete(e, doc.id)}
                    disabled={isDeleting}
                  >
                    삭제
                  </GlassButton>
                </ActionsRow>
              </DocumentCard>
            ))}
          </DocumentGrid>
        )}
      </MainPanel>
    </Container>
  );
}
