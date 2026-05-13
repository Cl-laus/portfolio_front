import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import './globals.css';
import NavBar from '@/components/NavBar';

const euclidCircularA = localFont({
  src: [
    { path: '../public/fonts/Euclid Circular A Light.ttf',    weight: '300', style: 'normal' },
    { path: '../public/fonts/Euclid Circular A Regular.ttf',  weight: '400', style: 'normal' },
    { path: '../public/fonts/Euclid Circular A Medium.ttf',   weight: '500', style: 'normal' },
    { path: '../public/fonts/Euclid Circular A SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/Euclid Circular A Bold.ttf',     weight: '700', style: 'normal' },
  ],
  variable: '--font-euclid',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lucas Luisetti — Portfolio',
  description: 'Designer-turned-developer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${euclidCircularA.variable} ${geistMono.variable} dark antialiased`}>
      <head>
        <link rel="preload" href="/hero.jpg" as="image" />
      </head>
      <body className="min-h-screen">
        <NavBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
