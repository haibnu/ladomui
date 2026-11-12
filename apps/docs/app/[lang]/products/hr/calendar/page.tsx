import type { Metadata } from 'next';
import { Calendar } from '@/components/products/hr/Calendar';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: ((await params).lang as Locale) === 'tr' ? 'Takvim' : 'Calendar',
  };
}

export default function Page() {
  return <Calendar />;
}
