import type { Metadata } from 'next';
import { Reports } from '@/components/products/hr/Reports';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: ((await params).lang as Locale) === 'tr' ? 'Raporlar' : 'Reports',
  };
}

export default function Page() {
  return <Reports />;
}
