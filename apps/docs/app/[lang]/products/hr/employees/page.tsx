import type { Metadata } from 'next';
import { Employees } from '@/components/products/hr/Employees';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: ((await params).lang as Locale) === 'tr' ? 'Personel' : 'Employees',
  };
}

export default function Page() {
  return <Employees />;
}
