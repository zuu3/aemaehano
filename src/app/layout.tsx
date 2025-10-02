import type { Metadata } from 'next';
import AppProviders from '@/app-provider';
import ThemeProvider from '@/components/ThemeProvider';
import ClientLayout from '@/components/ClientLayout';

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
    <html lang="ko">
      <body>
        <AppProviders>
          <ThemeProvider>
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}