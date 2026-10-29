import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import { ChoiceDoc } from '../ChoiceDoc';

export const metadata: Metadata = { title: 'Checkbox' };

export default async function CheckboxPage({ params }: { params: Promise<{ lang: string }> }) {
  return <ChoiceDoc kind="checkbox" lang={(await params).lang as Locale} />;
}
