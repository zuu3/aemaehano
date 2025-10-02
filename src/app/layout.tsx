import type { Metadata } from 'next';
import RootLayoutClient from '@/components/RootLayoutClient';

export const metadata: Metadata = {
  title: '애매한 텍스트 분석기',
  description: 'AI 기반 텍스트 명확성 분석 도구',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}