'use client';

import styled from '@emotion/styled';
import { AnalysisMode } from '@/types';
import { ANALYSIS_MODE_CONFIG } from '@/utils/analysisPrompts';

const Container = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ModeButton = styled.button<{ isActive: boolean }>`
  background: ${({ theme, isActive }) =>
    isActive
      ? `linear-gradient(135deg, ${theme.colors.accent}22, ${theme.colors.accent}11)`
      : theme.glass.bg
  };
  border: 2px solid ${({ theme, isActive }) =>
    isActive ? theme.colors.accent : theme.glass.stroke
  };
  border-radius: ${({ theme }) => theme.effects.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};
  text-align: center;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 12px ${({ theme }) => theme.glow.primary};
  }

  &:active {
    transform: translateY(0);
  }

  ${({ isActive, theme }) => isActive && `
    box-shadow: 0 0 20px ${theme.glow.primary};
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, ${theme.colors.accent}11, transparent);
      pointer-events: none;
    }
  `}
`;

const ModeIcon = styled.div`
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ModeName = styled.div<{ isActive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.accent : theme.text.primary
  };
  margin-bottom: 4px;
`;

const ModeDesc = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.3;
`;

interface ModeSelectorProps {
  selectedMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

const MODE_ICONS: Record<AnalysisMode, string> = {
  business: '📋',
  blog: '📝',
  casual: '💬',
  academic: '🎓',
  creative: '🎨',
};

const MODE_LABELS: Record<AnalysisMode, string> = {
  business: '업무/공식',
  blog: '블로그',
  casual: '일상',
  academic: '학술',
  creative: '창작',
};

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  const modes: AnalysisMode[] = ['business', 'blog', 'casual', 'academic', 'creative'];

  return (
    <Container>
      <Label>📊 분석 모드 선택</Label>
      <ModeGrid>
        {modes.map((mode) => (
          <ModeButton
            key={mode}
            isActive={selectedMode === mode}
            onClick={() => onModeChange(mode)}
          >
            <ModeIcon>{MODE_ICONS[mode]}</ModeIcon>
            <ModeName isActive={selectedMode === mode}>
              {MODE_LABELS[mode]}
            </ModeName>
            <ModeDesc>{ANALYSIS_MODE_CONFIG[mode].description}</ModeDesc>
          </ModeButton>
        ))}
      </ModeGrid>
    </Container>
  );
}
