'use client';

import styled from '@emotion/styled';
import { TextStatistics, formatReadingTime } from '@/utils/textStats';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.glass.bgAlt};
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  transition: all ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 12px ${({ theme }) => theme.glow.primary};
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

interface TextStatsDisplayProps {
  stats: TextStatistics;
}

export default function TextStatsDisplay({ stats }: TextStatsDisplayProps) {
  return (
    <StatsContainer>
      <StatCard>
        <StatValue>{stats.sentenceCount.toLocaleString()}</StatValue>
        <StatLabel>문장 수</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.wordCount.toLocaleString()}</StatValue>
        <StatLabel>단어 수</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.characterCount.toLocaleString()}</StatValue>
        <StatLabel>글자 수</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.averageSentenceLength}</StatValue>
        <StatLabel>문장당 평균 단어 수</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{formatReadingTime(stats.estimatedReadingTimeMinutes)}</StatValue>
        <StatLabel>읽기 시간</StatLabel>
      </StatCard>
    </StatsContainer>
  );
}
