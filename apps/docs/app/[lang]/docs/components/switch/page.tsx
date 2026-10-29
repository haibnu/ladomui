import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import { ChoiceDoc } from '../ChoiceDoc';

export const metadata: Metadata = { title: 'Switch' };

export default async function SwitchPage({ params }: { params: Promise<{ lang: string }> }) {
  return <ChoiceDoc kind="switch" lang={(await params).lang as Locale} />;
}
