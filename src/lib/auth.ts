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
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google') {
        token.provider = 'google';
      }
      if (profile && 'name' in profile) {
        token.name = profile.name as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string | undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
