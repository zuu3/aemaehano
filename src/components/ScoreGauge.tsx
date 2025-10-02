// src/components/ScoreGauge.tsx
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo } from 'react';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: number;
}

const GaugeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GaugeSvg = styled.svg`
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
`;

const ScoreText = styled.div`
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  font-variant-numeric: tabular-nums;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  /* Glow effect based on score - Accessibility: ensure text is still readable */
  text-shadow: 0 0 20px currentColor;
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 200 }) => {
  const theme = useTheme();
  
  // 점수 검증 및 정규화
  const normalizedScore = useMemo(() => {
    // NaN, null, undefined 체크
    if (score === null || score === undefined || isNaN(score)) {
      console.warn('Invalid score received:', score);
      return 0;
    }
    
    // 0-100 범위로 제한
    const validScore = Math.min(Math.max(Number(score), 0), 100);
    return Math.round(validScore);
  }, [score]);
  
  // Calculate color and label based on score
  const { color, glowColor, label } = useMemo(() => {
    // 높은 점수 = 명확함 (초록)
    // 낮은 점수 = 모호함 (빨강)
    if (normalizedScore >= 80) {
      return {
        color: theme.colors.success,
        glowColor: 'rgba(52, 199, 89, 0.4)',
        label: '매우 명확',
      };
    }
    if (normalizedScore >= 60) {
      return {
        color: theme.colors.info,
        glowColor: 'rgba(90, 200, 250, 0.4)',
        label: '명확',
      };
    }
    if (normalizedScore >= 40) {
      return {
        color: theme.colors.warning,
        glowColor: 'rgba(255, 149, 0, 0.4)',
        label: '보통',
      };
    }
    if (normalizedScore >= 20) {
      return {
        color: theme.colors.warning,
        glowColor: 'rgba(255, 149, 0, 0.4)',
        label: '모호함',
      };
    }
    return {
      color: theme.colors.danger,
      glowColor: 'rgba(255, 59, 48, 0.4)',
      label: '매우 모호함',
    };
  }, [normalizedScore, theme]);
  
  // Gauge calculations
  const radius = (size - 40) / 2;
  const strokeWidth = 12;
  const center = size / 2;
  
  // Arc angles (270 degree gauge, starting from bottom left)
  const startAngle = 135; // degrees
  const endAngle = 405; // 135 + 270
  const scoreAngle = startAngle + (normalizedScore / 100) * 270;
  
  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };
  
  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }
  
  const backgroundPath = describeArc(startAngle, endAngle);
  const scorePath = describeArc(startAngle, scoreAngle);
  
  return (
    <GaugeContainer>
      <GaugeSvg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`명확성 점수: ${normalizedScore}점, ${label}`}
      >
        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Background track - glass effect */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={theme.glass.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.3"
        />
        
        {/* Inner glow ring */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={theme.glass.bg}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          opacity="0.5"
          style={{ filter: 'blur(8px)' }}
        />
        
        {/* Score arc with glow */}
        <path
          d={scorePath}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transition: `d ${theme.motion.duration.slow} ${theme.motion.easing.easeOut}`,
          }}
        />
        
        {/* Outer highlight */}
        <path
          d={scorePath}
          fill="none"
          stroke={theme.glass.highlight}
          strokeWidth={2}
          strokeLinecap="round"
          opacity="0.5"
          style={{
            transform: `translate(0, -${strokeWidth / 2 + 1}px)`,
          }}
        />
        
        {/* Center indicator dot */}
        <circle
          cx={center}
          cy={center}
          r={8}
          fill={theme.glass.bg}
          stroke={theme.glass.stroke}
          strokeWidth="2"
        />
      </GaugeSvg>
      
      <ScoreText>
        <ScoreValue style={{ color }}>
          {normalizedScore}
          <span style={{ fontSize: '0.6em', opacity: 0.7 }}>점</span>
        </ScoreValue>
        <ScoreLabel>{label}</ScoreLabel>
      </ScoreText>
    </GaugeContainer>
  );
};

export default ScoreGauge;