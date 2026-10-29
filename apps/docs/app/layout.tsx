import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Hanken_Grotesk } from 'next/font/google';
import '@ladom/tokens/index.css';
import './globals.css';
import { themeInitScript } from '../components/ThemeToggle';

// The tokens read the loaded family from --font-hanken-grotesk, so the class must sit on <html>.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ui.ladom.co'),
  title: { default: 'Ladom UI', template: '%s · Ladom UI' },
  description: 'The Ladom design system: design tokens, icons and React components, aligned 1:1 with Figma.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme is set before hydration by themeInitScript.
    <html lang="en" className={hankenGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
