import type { ReactNode } from 'react';
import { TopBar } from '@/components/TopBar';
import type { Locale } from '@/i18n';

export default async function ProductsLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  return (
    <>
      <TopBar lang={lang} />
      {children}
    </>
  );
}
