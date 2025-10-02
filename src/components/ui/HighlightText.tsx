import styled from '@emotion/styled';
import { Badge } from '@/components/ui/Badge';
import type { AnalysisResult } from '@/types';

interface HighlightTextProps {
  result: AnalysisResult;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TextDisplay = styled.div`
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.glass.strokeAlt};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.text.primary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.glass.highlightSoft};
  }
`;

const Highlight = styled.mark<{ category: string }>`
  background: transparent;
  color: inherit;
  position: relative;
  padding: 2px 4px;
  border-radius: ${({ theme }) => theme.effects.radius.sm};
  cursor: help;
  transition: all ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.easeOut};
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme, category }) => {
      if (category === 'hedge' || category === 'vague') return theme.colors.warning;
      return theme.colors.info;
    }};
    opacity: 0.6;
    border-radius: ${({ theme }) => theme.effects.radius.full};
  }
  
  &:hover {
    background: ${({ theme, category }) => {
      if (category === 'hedge' || category === 'vague') return `${theme.colors.warning}15`;
      return `${theme.colors.info}15`;
    }};
    
    &::after {
      opacity: 1;
      height: 3px;
    }
  }
`;

const CategoriesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.text.secondary};
`;

const SuggestionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SuggestionItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.glass.strokeAlt};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.effects.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${({ theme }) => theme.glow.primary};
    opacity: 0.5;
  }
`;

const RewriteSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const RewriteCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.glass.bg};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.md});
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.success}, ${({ theme }) => theme.colors.info});
  }
`;

const RewriteLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RewriteText = styled.div<{ isImproved?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, isImproved }) => 
    isImproved ? `${theme.colors.success}15` : `${theme.colors.danger}15`};
  border-left: 3px solid ${({ theme, isImproved }) => 
    isImproved ? theme.colors.success : theme.colors.danger};
  border-radius: ${({ theme }) => theme.effects.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const RewriteReason = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  font-style: italic;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ theme }) => theme.spacing.md};
`;

const ArrowIcon = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const HighlightText: React.FC<HighlightTextProps> = ({ result }) => {
  const { original_text, highlights, categories, suggestions, rewriteSuggestions } = result;
  
  const hasHighlights = highlights && highlights.length > 0;
  
  const renderHighlightedText = () => {
    if (!hasHighlights) {
      return <span>{original_text}</span>;
    }
    
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    sortedHighlights.forEach((highlight, idx) => {
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {original_text.substring(lastIndex, highlight.start)}
          </span>
        );
      }
      
      parts.push(
        <Highlight
          key={`highlight-${idx}`}
          category={highlight.category}
          title={highlight.reason}
        >
          {original_text.substring(highlight.start, highlight.end)}
        </Highlight>
      );
      
      lastIndex = highlight.end;
    });
    
    if (lastIndex < original_text.length) {
      parts.push(
        <span key="text-end">
          {original_text.substring(lastIndex)}
        </span>
      );
    }
    
    return <>{parts}</>;
  };
  
  const getCategoryVariant = (category: string): 'warning' | 'info' | 'success' => {
    if (category === 'hedge' || category === 'vague') return 'warning';
    return 'info';
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'hedge': '불확실',
      'vague': '모호',
      'softener': '완곡',
      'apology': '과도한 사과',
      'filler': '불필요한 표현',
    };
    return labels[category] || category;
  };
  
  return (
    <Container>
      <TextDisplay aria-label="분석된 텍스트">
        {renderHighlightedText()}
      </TextDisplay>
      
      {!hasHighlights && (
        <CategoriesSection>
          <Badge variant="success" size="sm">
            ✓ 명확한 텍스트
          </Badge>
          <CategoryLabel>문제가 발견되지 않았습니다</CategoryLabel>
        </CategoriesSection>
      )}
      
      {categories && categories.length > 0 && (
        <CategoriesSection>
          <CategoryLabel>발견된 문제:</CategoryLabel>
          {categories.map((category, idx) => (
            <Badge
              key={idx}
              variant={getCategoryVariant(category)}
              size="sm"
            >
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </CategoriesSection>
      )}

      {rewriteSuggestions && rewriteSuggestions.length > 0 && (
        <RewriteSection>
          <CategoryLabel>✨ AI 문장 개선 제안</CategoryLabel>
          {rewriteSuggestions.map((rewrite, idx) => (
            <RewriteCard key={idx}>
              <RewriteLabel>원본</RewriteLabel>
              <RewriteText isImproved={false}>
                {rewrite.original}
              </RewriteText>
              
              <ArrowIcon>↓</ArrowIcon>
              
              <RewriteLabel>개선</RewriteLabel>
              <RewriteText isImproved={true}>
                {rewrite.improved}
              </RewriteText>
              
              <RewriteReason>
                💡 {rewrite.reason}
              </RewriteReason>
            </RewriteCard>
          ))}
        </RewriteSection>
      )}

      {suggestions && suggestions.length > 0 && (
        <SuggestionsSection>
          <CategoryLabel>일반 개선 제안:</CategoryLabel>
          {suggestions.map((suggestion, idx) => (
            <SuggestionItem key={idx}>
              {suggestion}
            </SuggestionItem>
          ))}
        </SuggestionsSection>
      )}
    </Container>
  );
};

export default HighlightText;