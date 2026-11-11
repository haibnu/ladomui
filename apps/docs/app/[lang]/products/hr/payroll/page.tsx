import type { Metadata } from 'next';
import { Payroll } from '@/components/products/hr/Payroll';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: ((await params).lang as Locale) === 'tr' ? 'Bordro' : 'Payroll',
  };
}

export default function Page() {
  return <Payroll />;
}
