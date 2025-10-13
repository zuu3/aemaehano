'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import UserMenu from '@/components/ui/UserMenu';
import { ReactNode } from 'react';

const AppHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.lg});
  background: ${({ theme }) => theme.glass.bgAlt};
  border-bottom: 1px solid ${({ theme }) => theme.glass.strokeAlt};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.glow.primary};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  border: 2px solid ${({ theme }) => theme.glass.stroke};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.sm});
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const MainContent = styled.main`
  padding-top: 80px; /* Account for fixed header */
`;

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <AppHeader>
        <LogoLink href="/">
          <LogoIcon>애</LogoIcon>
          <LogoText>애매하노</LogoText>
        </LogoLink>
        <UserMenu />
      </AppHeader>
      <MainContent>{children}</MainContent>
    </>
  );
}