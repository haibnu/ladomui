import type { Metadata } from 'next';
import { Leave } from '@/components/products/hr/Leave';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: ((await params).lang as Locale) === 'tr' ? 'İzinler' : 'Leave',
  };
}

export default function Page() {
  return <Leave />;
}
