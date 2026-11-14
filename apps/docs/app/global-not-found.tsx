import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Hanken_Grotesk } from 'next/font/google';
import '@ladom/tokens/index.css';
import './globals.css';
import { NotFound } from '@/components/NotFound';
import { themeInitScript } from '@/components/ThemeToggle';
import { customizeInitScript } from '@/components/customize/theme';
import type { Locale } from '@/i18n';

// URLs that match no route. The root layout is app/[lang]/layout.tsx, so this page brings its own
// document, font and theme scripts. The language comes from the URL (/tr/...), else the browser.
const hankenGrotesk = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken-grotesk' });

export const metadata: Metadata = { title: '404 · Ladom UI' };

export default async function GlobalNotFound() {
  const accept = (await headers()).get('accept-language') ?? '';
  const fallback: Locale = /^tr\b/i.test(accept) ? 'tr' : 'en';
  return (
    <html lang={fallback} className={hankenGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: customizeInitScript }} />
      </head>
      <body>
        <NotFound fallback={fallback} />
      </body>
    </html>
  );
}
