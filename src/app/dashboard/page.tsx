'use client';

import { useMemo } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useDocuments } from '@/hooks/useDocuments';
import { GlassPanel } from '@/components/ui/GlassPanel';
import ScoreGauge from '@/components/ui/ScoreGauge';
import { Badge } from '@/components/ui/Badge';
import { ANALYSIS_MODE_CONFIG } from '@/utils/analysisPrompts';
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
  max-width: 1200px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 0 0 40px rgba(122, 165, 255, 0.15);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  width: 100%;
`;

const StatCard = styled(GlassPanel)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.text.secondary};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TopIssuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IssueItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.md};
`;

const IssueName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.text.primary};
`;

const IssueCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.text.secondary};
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const RecentDocItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.md};
  transition: all ${({ theme }) => theme.motion.duration.fast};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 12px ${({ theme }) => theme.glow.primary};
  }
`;

const DocTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DocMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  flex-wrap: wrap;
`;

const ScoreDistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.glass.stroke};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DistLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DistBar = styled.div<{ width: number; color: string }>`
  height: 8px;
  width: ${({ width }) => width}%;
  background: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.effects.radius.full};
  transition: width ${({ theme }) => theme.motion.duration.normal};
`;

export default function DashboardPage() {
  const { data: documents, isLoading } = useDocuments();

  const stats = useMemo(() => {
    if (!documents || documents.length === 0) {
      return {
        totalAnalyses: 0,
        averageScore: 0,
        topIssues: [],
        modeStats: [],
        recentDocuments: [],
        scoreDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
      };
    }

    const totalAnalyses = documents.length;
    const averageScore = Math.round(
      documents.reduce((sum, doc) => sum + doc.ambiguity_score, 0) / totalAnalyses
    );

    // 카테고리별 빈도수 계산
    const categoryCount: Record<string, number> = {};
    documents.forEach(doc => {
      doc.categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    // TOP 5 추출
    const topIssues = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // 모드별 통계
    const modeCount: Record<string, number> = {};
    documents.forEach(doc => {
      const mode = doc.analysis_mode || 'business';
      modeCount[mode] = (modeCount[mode] || 0) + 1;
    });
    const modeStats = Object.entries(modeCount)
      .sort(([, a], [, b]) => b - a)
      .map(([mode, count]) => ({ mode: mode as AnalysisMode, count }));

    // 최근 5개 문서
    const recentDocuments = [...documents]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // 점수 분포
    const scoreDistribution = {
      excellent: documents.filter(d => d.ambiguity_score >= 80).length,
      good: documents.filter(d => d.ambiguity_score >= 60 && d.ambiguity_score < 80).length,
      fair: documents.filter(d => d.ambiguity_score >= 40 && d.ambiguity_score < 60).length,
      poor: documents.filter(d => d.ambiguity_score < 40).length,
    };

    return {
      totalAnalyses,
      averageScore,
      topIssues,
      modeStats,
      recentDocuments,
      scoreDistribution,
    };
  }, [documents]);

  const categoryLabels: Record<string, string> = {
    hedge: '불확실한 표현',
    vague: '모호한 표현',
    softener: '완곡한 표현',
    apology: '과도한 사과',
    filler: '불필요한 표현',
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📊 대시보드</Title>
      </Header>

      <DashboardGrid>
        <StatCard elevation="medium" glow>
          <StatValue>{stats.totalAnalyses}</StatValue>
          <StatLabel>총 분석 횟수</StatLabel>
        </StatCard>

        <StatCard elevation="medium" glow>
          <ScoreGauge score={stats.averageScore} />
          <StatLabel style={{ marginTop: '16px' }}>평균 명확도 점수</StatLabel>
        </StatCard>

        <StatCard elevation="medium" glow>
          <StatValue>
            {documents && documents.length > 0
              ? `${Math.round((documents.filter(d => d.ambiguity_score >= 70).length / documents.length) * 100)}%`
              : '0%'
            }
          </StatValue>
          <StatLabel>명확한 글 비율 (70점 이상)</StatLabel>
        </StatCard>
      </DashboardGrid>

      <TwoColumnGrid>
        {/* 모드별 사용 통계 */}
        {stats.modeStats.length > 0 && (
          <GlassPanel elevation="medium" glow style={{ padding: '24px' }}>
            <SectionTitle>📊 모드별 사용 통계</SectionTitle>
            <TopIssuesContainer>
              {stats.modeStats.map(({ mode, count }) => (
                <IssueItem key={mode}>
                  <IssueName>{ANALYSIS_MODE_CONFIG[mode].name}</IssueName>
                  <IssueCount>{count}회</IssueCount>
                </IssueItem>
              ))}
            </TopIssuesContainer>
          </GlassPanel>
        )}

        {/* 점수 분포 */}
        {stats.totalAnalyses > 0 && (
          <GlassPanel elevation="medium" glow style={{ padding: '24px' }}>
            <SectionTitle>📈 점수 분포</SectionTitle>
            <div>
              <ScoreDistItem>
                <DistLabel>
                  <span>⭐ 우수 (80~100점)</span>
                </DistLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                  <DistBar width={(stats.scoreDistribution.excellent / stats.totalAnalyses) * 100} color="#7aa5ff" />
                  <span style={{ minWidth: '40px', textAlign: 'right' }}>{stats.scoreDistribution.excellent}개</span>
                </div>
              </ScoreDistItem>
              <ScoreDistItem>
                <DistLabel>
                  <span>✅ 양호 (60~79점)</span>
                </DistLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                  <DistBar width={(stats.scoreDistribution.good / stats.totalAnalyses) * 100} color="#4ade80" />
                  <span style={{ minWidth: '40px', textAlign: 'right' }}>{stats.scoreDistribution.good}개</span>
                </div>
              </ScoreDistItem>
              <ScoreDistItem>
                <DistLabel>
                  <span>⚠️ 보통 (40~59점)</span>
                </DistLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                  <DistBar width={(stats.scoreDistribution.fair / stats.totalAnalyses) * 100} color="#fbbf24" />
                  <span style={{ minWidth: '40px', textAlign: 'right' }}>{stats.scoreDistribution.fair}개</span>
                </div>
              </ScoreDistItem>
              <ScoreDistItem>
                <DistLabel>
                  <span>❌ 개선필요 (0~39점)</span>
                </DistLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                  <DistBar width={(stats.scoreDistribution.poor / stats.totalAnalyses) * 100} color="#f87171" />
                  <span style={{ minWidth: '40px', textAlign: 'right' }}>{stats.scoreDistribution.poor}개</span>
                </div>
              </ScoreDistItem>
            </div>
          </GlassPanel>
        )}
      </TwoColumnGrid>

      {/* TOP 5 이슈 */}
      {stats.topIssues.length > 0 && (
        <GlassPanel elevation="high" glow style={{ maxWidth: '1200px', width: '100%', padding: '32px' }}>
          <SectionTitle>🔍 자주 발견되는 애매한 표현 TOP 5</SectionTitle>
          <TopIssuesContainer>
            {stats.topIssues.map(({ category, count }, index) => (
              <IssueItem key={category}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge variant={category as any}>
                    #{index + 1}
                  </Badge>
                  <IssueName>{categoryLabels[category] || category}</IssueName>
                </div>
                <IssueCount>{count}회</IssueCount>
              </IssueItem>
            ))}
          </TopIssuesContainer>
        </GlassPanel>
      )}

      {/* 최근 분석 문서 */}
      {stats.recentDocuments.length > 0 && (
        <GlassPanel elevation="high" glow style={{ maxWidth: '1200px', width: '100%', padding: '32px' }}>
          <SectionTitle>📄 최근 분석한 문서</SectionTitle>
          <TopIssuesContainer>
            {stats.recentDocuments.map((doc) => (
              <Link key={doc.id} href={`/documents/${doc.id}`} style={{ textDecoration: 'none' }}>
                <RecentDocItem>
                  <DocTitle>{doc.title}</DocTitle>
                  <DocMeta>
                    <Badge variant={doc.ambiguity_score >= 70 ? 'success' : 'warning'}>
                      {doc.ambiguity_score}점
                    </Badge>
                    {doc.analysis_mode && (
                      <span>{ANALYSIS_MODE_CONFIG[doc.analysis_mode].name}</span>
                    )}
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString('ko-KR')}</span>
                    <span>•</span>
                    <span>{doc.highlights.length}개 이슈</span>
                  </DocMeta>
                </RecentDocItem>
              </Link>
            ))}
          </TopIssuesContainer>
        </GlassPanel>
      )}

      {stats.totalAnalyses === 0 && (
        <LoadingMessage>
          아직 분석한 문서가 없습니다.<br />
          텍스트를 분석하고 저장해보세요!
        </LoadingMessage>
      )}
    </Container>
  );
}
