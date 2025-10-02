import type { Metadata } from 'next';
import AppProviders from '@/app-provider';

export const metadata: Metadata = {
  title: 'aemaehano',
  description: '약한표현 탐지 & 설득력 점수',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
