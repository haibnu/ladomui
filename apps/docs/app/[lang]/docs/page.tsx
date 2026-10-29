import { redirect } from 'next/navigation';
import { href, type Locale } from '@/i18n';

export default async function DocsIndex({ params }: { params: Promise<{ lang: string }> }) {
  redirect(href((await params).lang as Locale, '/docs/introduction'));
}
