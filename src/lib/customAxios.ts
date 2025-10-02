import axios from 'axios';

/**
 * NextAuth는 세션 쿠키로 인증되므로
 * 별도 토큰 주입 없이 same-origin 요청만 하면 됨.
 * (SSR/Route Handler에서 getServerSession으로 검증)
 */
export const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
