import styled from '@emotion/styled';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const StyledBadge = styled.span<BadgeProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.effects.radius.full};
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  
  /* Size variants */
  ${({ size = 'md', theme }) => {
    if (size === 'sm')
      return `
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.typography.fontSize.xs};
        line-height: 1.2;
      `;
    return `
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
      line-height: 1.3;
    `;
  }}
  
  /* Glass effect */
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.glass.strokeAlt};
  
  /* Color variants with glow */
  ${({ theme, variant = 'default' }) => {
    if (variant === 'success')
      return `
        border-color: ${theme.colors.success}40;
        color: ${theme.colors.success};
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${theme.glow.success};
          opacity: 0.6;
        }
      `;
    if (variant === 'warning')
      return `
        border-color: ${theme.colors.warning}40;
        color: ${theme.colors.warning};
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 120% at 20% 10%, rgba(255, 149, 0, 0.18) 0%, rgba(255, 149, 0, 0) 60%);
          opacity: 0.6;
        }
      `;
    if (variant === 'danger')
      return `
        border-color: ${theme.colors.danger}40;
        color: ${theme.colors.danger};
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${theme.glow.danger};
          opacity: 0.6;
        }
      `;
    if (variant === 'info')
      return `
        border-color: ${theme.colors.info}40;
        color: ${theme.colors.info};
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 120% at 20% 10%, rgba(90, 200, 250, 0.18) 0%, rgba(90, 200, 250, 0) 60%);
          opacity: 0.6;
        }
      `;
    return `
      color: ${theme.text.secondary};
    `;
  }}
  
  /* Ensure content is above glow */
  & > * {
    position: relative;
    z-index: 1;
  }
  
  transition: all ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.easeOut};
`;

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  ...props 
}) => {
  return (
    <StyledBadge variant={variant} size={size} {...props}>
      {children}
    </StyledBadge>
  );
};