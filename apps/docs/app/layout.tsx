import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Hanken_Grotesk } from 'next/font/google';
import '@ladom/tokens/index.css';
import './globals.css';

// The tokens read the loaded family from --font-hanken-grotesk, so the class must sit on <html>.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken-grotesk',
});

export const metadata: Metadata = {
  title: 'Ladom UI',
  description: 'Ladom design system documentation',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
