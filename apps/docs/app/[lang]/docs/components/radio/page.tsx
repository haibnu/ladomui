import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import { ChoiceDoc } from '../ChoiceDoc';

export const metadata: Metadata = { title: 'Radio' };

export default async function RadioPage({ params }: { params: Promise<{ lang: string }> }) {
  return <ChoiceDoc kind="radio" lang={(await params).lang as Locale} />;
}
