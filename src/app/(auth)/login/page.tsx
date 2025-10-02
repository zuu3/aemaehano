'use client';

import styled from '@emotion/styled';
import { signIn } from 'next-auth/react';

const Wrap = styled.div`max-width:480px;margin:80px auto;padding:24px;background:#151a2f;border-radius:16px;text-align:center;`;
const Button = styled.button`padding:10px 14px;border:none;border-radius:10px;background:#6b8cff;color:#fff;font-weight:700;`;

export default function LoginPage() {
  return (
    <Wrap>
      <h2>로그인</h2>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>Google 계정으로 로그인하세요.</p>
      <Button onClick={() => signIn('google', { callbackUrl: '/' })}>Google 로그인</Button>
    </Wrap>
  );
}
