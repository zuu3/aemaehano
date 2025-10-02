import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // 세션=JWT
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 최초 로그인 시 구글 계정 정보 토큰에 병합
      if (account?.provider === 'google') {
        token.provider = 'google';
      }
      if (profile && 'name' in profile) {
        token.name = (profile as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트에서 session.user 접근 가능
      if (session.user) {
        session.user.name = token.name as string | undefined;
        (session as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // 커스텀 로그인 페이지
  },
};
