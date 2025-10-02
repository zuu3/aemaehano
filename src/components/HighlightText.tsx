// src/components/HighlightText.tsx
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
      // hedge, vague는 경고
      if (category === 'hedge' || category === 'vague') return theme.colors.warning;
      // softener, apology, filler는 정보
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

const HighlightText: React.FC<HighlightTextProps> = ({ result }) => {
  const { original_text, highlights, categories, suggestions } = result;
  
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

      {suggestions && suggestions.length > 0 && (
        <SuggestionsSection>
          <CategoryLabel>개선 제안:</CategoryLabel>
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