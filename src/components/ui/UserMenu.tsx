'use client';

import { signOut, useSession } from 'next-auth/react';
import styled from '@emotion/styled';
import { GlassButton } from '@/components/ui/GlassButton';
import { useState, useRef, useEffect } from 'react';

const MenuContainer = styled.div`
  position: relative;
`;

const UserButton = styled(GlassButton)`
  min-width: 120px;
  border-radius: ${({ theme }) => theme.effects.radius.full};
  
  /* Capsule shape with user info */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.glow.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  border: 2px solid ${({ theme }) => theme.glass.stroke};
  flex-shrink: 0;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.glass.bg};
  backdrop-filter: blur(${({ theme }) => theme.effects.blur.lg});
  border: 1px solid ${({ theme }) => theme.glass.stroke};
  border-radius: ${({ theme }) => theme.effects.radius.lg};
  box-shadow: ${({ theme }) => theme.effects.shadow.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 1000;
  
  /* Animation */
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: translateY(${({ isOpen }) => (isOpen ? 0 : '-8px')});
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition: all ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.easeOut};
  
  /* Top highlight */
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
  
  /* Accessibility: Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: opacity ${({ theme }) => theme.motion.duration.fast};
    transform: none;
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.effects.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.easeOut};
  
  &:hover {
    background: ${({ theme }) => theme.glass.bgHover};
    color: ${({ theme }) => theme.text.primary};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* Accessibility: Focus state */
  &:focus-visible {
    outline: ${({ theme }) => theme.effects.ring.width} solid ${({ theme }) => theme.effects.ring.color};
    outline-offset: ${({ theme }) => theme.effects.ring.offset};
  }
`;

const UserMenu = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!session?.user) {
    return (
      <GlassButton
        variant="primary"
        size="sm"
        onClick={() => window.location.href = '/login'}
        aria-label="로그인"
      >
        로그인
      </GlassButton>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <MenuContainer ref={menuRef}>
      <UserButton
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`사용자 메뉴 ${isOpen ? '닫기' : '열기'}`}
      >
        <UserAvatar aria-hidden="true">{initials}</UserAvatar>
        <UserName>{user.name || user.email}</UserName>
      </UserButton>

      <Dropdown isOpen={isOpen} role="menu" aria-label="사용자 메뉴">
        <DropdownItem
          onClick={() => {
            window.location.href = '/documents';
            setIsOpen(false);
          }}
          role="menuitem"
          aria-label="저장된 문서"
        >
          📄 저장된 문서
        </DropdownItem>
        <DropdownItem
          onClick={handleSignOut}
          role="menuitem"
          aria-label="로그아웃"
        >
          로그아웃
        </DropdownItem>
      </Dropdown>
    </MenuContainer>
  );
};

export default UserMenu;