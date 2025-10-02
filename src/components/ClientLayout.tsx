// src/components/ClientLayout.tsx
'use client';

import styled from '@emotion/styled';
import UserMenu from '@/components/UserMenu';
import { ReactNode } from 'react';

const AppHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.lg});
  background: ${({ theme }) => theme.glass.bgAlt};
  border-bottom: 1px solid ${({ theme }) => theme.glass.strokeAlt};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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
        <UserMenu />
      </AppHeader>
      <MainContent>{children}</MainContent>
    </>
  );
}