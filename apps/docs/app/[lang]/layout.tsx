import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Hanken_Grotesk } from 'next/font/google';
import '@ladom/tokens/index.css';
import '../globals.css';
import { themeInitScript } from '@/components/ThemeToggle';
import { customizeInitScript } from '@/components/customize/theme';
import { getDictionary, isLocale, locales } from '@/i18n';

// The tokens read the loaded family from --font-hanken-grotesk, so the class must sit on <html>.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken-grotesk',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    metadataBase: new URL('https://ui.ladom.co'),
    title: { default: 'Ladom UI', template: '%s · Ladom UI' },
    description: getDictionary(lang).meta.description,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    // data-theme is set before hydration by themeInitScript.
    <html lang={lang} className={hankenGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: customizeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
