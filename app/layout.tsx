import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lending Heights Hub',
  description: 'Your centralized portal for all Lending Heights applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-poppins">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
