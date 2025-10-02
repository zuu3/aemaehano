import styled from '@emotion/styled';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  glow?: boolean;
}

const StyledCard = styled.div<CardProps>`
  background: ${({ theme }) => theme.glass.bg};
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
  
  padding: ${({ theme }) => theme.spacing.lg};
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
      background: ${theme.glow.accent};
      pointer-events: none;
      opacity: 0.6;
    }
  `}

  ${({ interactive, theme }) =>
    interactive &&
    `
    cursor: pointer;
    transition: all ${theme.motion.duration.normal} ${theme.motion.easing.easeOut};
    
    &:hover {
      transform: translateY(-2px);
      background: ${theme.glass.bgHover};
      border-color: ${theme.glass.highlight};
      box-shadow: ${theme.effects.shadow.lg};
    }
    
    &:active {
      transform: translateY(0) scale(0.99);
    }
  `}
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Card: React.FC<CardProps> = ({ 
  children, 
  elevation = 'medium',
  interactive = false,
  glow = false,
  ...props 
}) => {
  return (
    <StyledCard 
      elevation={elevation} 
      interactive={interactive}
      glow={glow}
      {...props}
    >
      {children}
    </StyledCard>
  );
};