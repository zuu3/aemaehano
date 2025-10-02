'use client';

import styled from '@emotion/styled';
import { signIn, signOut, useSession } from 'next-auth/react';

const Wrap = styled.div`display:flex; align-items:center; gap:8px;`;
const Button = styled.button`
  background:#6b8cff; color:white; border:none; padding:8px 12px; border-radius:10px; font-weight:700;
`;

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  return (
    <Wrap>
      {session?.user ? (
        <>
          <span style={{ opacity: 0.8 }}>{session.user.name}</span>
          <Button onClick={() => signOut({ callbackUrl: '/login' })}>로그아웃</Button>
        </>
      ) : (
        <Button onClick={() => signIn('google', { callbackUrl: '/' })}>Google 로그인</Button>
      )}
    </Wrap>
  );
}
