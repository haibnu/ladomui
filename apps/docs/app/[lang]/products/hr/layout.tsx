import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HrShell } from '@/components/products/hr/HrShell';
import { CustomizeBar } from '@/components/products/CustomizeBar';
import { getDictionary, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const p = getDictionary(lang).products;
  return {
    title: {
      default: lang === 'tr' ? 'İK Uygulaması' : 'HR app',
      template: `%s · ${lang === 'tr' ? 'İK Uygulaması' : 'HR app'} · Ladom UI`,
    },
    description: p.lead,
  };
}

export default function HrLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CustomizeBar />
      <HrShell>{children}</HrShell>
    </>
  );
}
