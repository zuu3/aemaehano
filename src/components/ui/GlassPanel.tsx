import styled from '@emotion/styled';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'elevated' | 'overlay';
  glow?: boolean;
}

const StyledPanel = styled.div<GlassPanelProps>`
  background: ${({ theme, variant = 'default' }) => {
    if (variant === 'elevated') return theme.glass.bgAlt;
    if (variant === 'overlay') return theme.glass.bgHover;
    return theme.glass.bg;
  }};
  
  backdrop-filter: blur(${({ theme, elevation = 'medium' }) => {
    if (elevation === 'low') return theme.effects.blur.sm;
    if (elevation === 'high') return theme.effects.blur.lg;
    return theme.effects.blur.md;
  }});
  
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.xl};
  
  box-shadow: ${({ theme, elevation = 'medium' }) => {
    if (elevation === 'low') return theme.effects.shadow.sm;
    if (elevation === 'high') return theme.effects.shadow.lg;
    return theme.effects.shadow.md;
  }};
  
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.glass.highlight};
    opacity: 0.5;
  }
  
  ${({ theme, glow }) =>
    glow &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${theme.glow.primary};
      pointer-events: none;
      opacity: 0.8;
    }
  `}
  
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.easeOut};
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, elevation = 'medium', variant = 'default', glow = false, ...props }, ref) => {
    return (
      <StyledPanel ref={ref} elevation={elevation} variant={variant} glow={glow} {...props}>
        {children}
      </StyledPanel>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';