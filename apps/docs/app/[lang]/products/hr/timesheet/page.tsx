import type { Metadata } from 'next';
import { Timesheet } from '@/components/products/hr/Timesheet';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: ((await params).lang as Locale) === 'tr' ? 'Puantaj' : 'Timesheet',
  };
}

export default function Page() {
  return <Timesheet />;
}
