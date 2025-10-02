import styled from '@emotion/styled';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled('button', {
  shouldForwardProp: (prop) => !['loading', 'fullWidth', 'variant', 'size'].includes(prop)
})<GlassButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.easeOut};
  
  ${({ size = 'md', theme }) => {
    if (size === 'sm')
      return `
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.sm};
        min-height: 36px;
      `;
    if (size === 'lg')
      return `
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: ${theme.typography.fontSize.lg};
        min-height: 52px;
      `;
    return `
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.base};
      min-height: 44px;
    `;
  }}
  
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  
  ${({ theme, variant = 'primary' }) => {
    if (variant === 'primary')
      return `
        background: ${theme.glass.bg};
        backdrop-filter: blur(${theme.effects.blur.md});
        border: 1px solid ${theme.glass.stroke};
        color: ${theme.text.primary};
        box-shadow: ${theme.effects.shadow.sm};
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme.glow.primary};
          opacity: 0;
          transition: opacity ${theme.motion.duration.normal} ${theme.motion.easing.easeOut};
        }
      `;
    if (variant === 'secondary')
      return `
        background: ${theme.glass.bgAlt};
        backdrop-filter: blur(${theme.effects.blur.sm});
        border: 1px solid ${theme.glass.strokeAlt};
        color: ${theme.text.secondary};
      `;
    return `
      background: transparent;
      border: 1px solid transparent;
      color: ${theme.text.secondary};
    `;
  }}
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    ${({ theme, variant = 'primary' }) => {
      if (variant === 'primary')
        return `
          background: ${theme.glass.bgHover};
          border-color: ${theme.glass.highlight};
          box-shadow: ${theme.effects.shadow.md};
          
          &::before {
            opacity: 1;
          }
        `;
      if (variant === 'secondary')
        return `
          background: ${theme.glass.bg};
          color: ${theme.text.primary};
        `;
      return `
        background: ${theme.glass.bgAlt};
        color: ${theme.text.primary};
      `;
    }}
  }
  
  &:active:not(:disabled) {
    transform: scale(0.985);
    ${({ theme }) => `
      box-shadow: ${theme.effects.shadow.inner}, ${theme.effects.shadow.sm};
    `}
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  ${({ loading }) =>
    loading &&
    `
    pointer-events: none;
    opacity: 0.7;
  `}

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.glass.stroke};
  border-top-color: ${({ theme }) => theme.text.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border-top-color: ${({ theme }) => theme.glass.stroke};
  }
`;

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        loading={loading}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner aria-label="Loading" />}
        {children}
      </StyledButton>
    );
  }
);

GlassButton.displayName = 'GlassButton';