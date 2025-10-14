'use client';

import { signIn } from 'next-auth/react';
import styled from '@emotion/styled';
import { Card } from '@/components/ui/Card';
import { GlassButton } from '@/components/ui/GlassButton';
import { useState } from 'react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const LoginCard = styled(Card)`
  max-width: 480px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.glow.primary};
  border-radius: ${({ theme }) => theme.effects.radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  border: 2px solid ${({ theme }) => theme.glass.stroke};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.md});
  position: relative;
  
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const GoogleIcon = styled.svg`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.glass.strokeAlt};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  
  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.glass.bgAlt};
    border: 1px solid ${({ theme }) => theme.glass.stroke};
    color: ${({ theme }) => theme.colors.success};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    flex-shrink: 0;
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.glass.bgAlt};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.effects.radius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.glow.danger};
    opacity: 0.4;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard elevation="high" glow>
        <Logo aria-hidden="true">애</Logo>

        <Title>애매한 텍스트 분석기</Title>
        <Subtitle>
          AI 기반 텍스트 명확성 분석 도구
        </Subtitle>

        {error && (
          <ErrorMessage role="alert">
            {error}
          </ErrorMessage>
        )}

        <ButtonGroup>
          <GlassButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            loading={isLoading}
            aria-label={isLoading ? '로그인 중...' : 'Google로 시작하기'}
          >
            {!isLoading && (
              <GoogleIcon viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </GoogleIcon>
            )}
            {isLoading ? '로그인 중...' : 'Google로 시작하기'}
          </GlassButton>
        </ButtonGroup>

        <Divider>
          <span>서비스 특징</span>
        </Divider>

        <FeatureList>
          <FeatureItem>AI 기반 텍스트 모호성 분석</FeatureItem>
          <FeatureItem>실시간 하이라이트 및 제안</FeatureItem>
          <FeatureItem>직관적인 점수 시각화</FeatureItem>
          <FeatureItem>안전한 구글 로그인</FeatureItem>
        </FeatureList>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;