'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.3s ease-out;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const Spinner = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid ${({ theme }) => theme.glass.stroke};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: ${({ theme }) => theme.glow.primary};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SubMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
`;

const messages = [
  { main: '🤖 AI가 텍스트를 읽고 있어요...', sub: '애매한 표현을 찾는 중' },
  { main: '🔍 문장을 분석하고 있어요...', sub: '패턴을 파악하는 중' },
  { main: '✨ 개선 방안을 생각하고 있어요...', sub: '더 명확한 표현 찾는 중' },
  { main: '📊 점수를 계산하고 있어요...', sub: '거의 다 됐어요!' },
];

interface LoadingAnimationProps {
  stage?: number; // 0-3, 분석 단계
}

export default function LoadingAnimation({ stage = 0 }: LoadingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // 자동으로 메시지 순환 (3초마다)
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const message = messages[stage || currentStage];

  return (
    <LoadingContainer>
      <SpinnerContainer>
        <Spinner />
        <InnerCircle />
      </SpinnerContainer>
      <MessageContainer>
        <LoadingMessage>{message.main}</LoadingMessage>
        <SubMessage>{message.sub}</SubMessage>
      </MessageContainer>
    </LoadingContainer>
  );
}
