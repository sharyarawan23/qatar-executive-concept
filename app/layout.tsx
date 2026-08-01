import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qatar Executive — The World, On Your Terms',
  description: 'Unofficial Qatar Executive cinematic redesign concept.',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
