// app/layout.tsx
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Mon portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geist.variable} font-sans antialiased bg-zinc-950 text-zinc-50 min-h-screen`}
        style={{
          fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui',
        }}
      >
        <main className="max-w-7xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
