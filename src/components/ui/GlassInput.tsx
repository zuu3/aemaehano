import styled from '@emotion/styled';
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface BaseInputProps {
  hasError?: boolean;
  fullWidth?: boolean;
}

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

const StyledInputWrapper = styled.div<BaseInputProps>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.glass.bg};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.md});
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.danger : theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.easeOut};
  position: relative;
  overflow: hidden;
  
  ${({ fullWidth }) => !fullWidth && 'max-width: 100%;'}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.glass.highlightSoft};
    opacity: 0.5;
  }
  
  &:focus-within {
    background: ${({ theme }) => theme.glass.bgHover};
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.danger : theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? 'rgba(255, 59, 48, 0.15)' : 'rgba(122, 165, 255, 0.15)'};
  }
  
  &:hover:not(:focus-within) {
    background: ${({ theme }) => theme.glass.bgAlt};
  }
  
  &:has(input:disabled), &:has(textarea:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input<GlassInputProps>`
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background: transparent;
  border: none;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ${inputStyles}
  height: 40px;
`;

const StyledTextarea = styled.textarea<GlassTextareaProps>`
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background: transparent;
  border: none;
  outline: none;
  min-height: 120px;
  resize: vertical;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  
  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ hasError = false, fullWidth = true, ...props }, ref) => {
    return (
      <StyledInputWrapper hasError={hasError} fullWidth={fullWidth}>
        <StyledInput ref={ref} hasError={hasError} {...props} />
      </StyledInputWrapper>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ hasError = false, fullWidth = true, ...props }, ref) => {
    return (
      <StyledInputWrapper hasError={hasError} fullWidth={fullWidth}>
        <StyledTextarea ref={ref} hasError={hasError} {...props} />
      </StyledInputWrapper>
    );
  }
);

GlassTextarea.displayName = 'GlassTextarea';