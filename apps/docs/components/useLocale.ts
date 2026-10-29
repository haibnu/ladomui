'use client';

import { useParams } from 'next/navigation';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';

/** Language of the current page (the [lang] route segment) and its dictionary, for client components. */
export function useLocale() {
  const param = useParams<{ lang: string }>().lang;
  const lang: Locale = param && isLocale(param) ? param : defaultLocale;
  return { lang, t: getDictionary(lang) };
}
