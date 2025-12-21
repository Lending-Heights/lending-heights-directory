import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Team Directory | Lending Heights Mortgage',
  description: 'Connect with your Lending Heights teammates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
