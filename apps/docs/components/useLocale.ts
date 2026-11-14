'use client';

import { useParams, usePathname } from 'next/navigation';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';

/** Language of the current page (the [lang] route segment) and its dictionary, for client components.
 *  The 404 page for unmatched URLs has no params, so the first path segment is the fallback. */
export function useLocale() {
  const param = useParams<{ lang: string }>()?.lang;
  const first = usePathname()?.split('/')[1] ?? '';
  const value = param ?? first;
  const lang: Locale = isLocale(value) ? value : defaultLocale;
  return { lang, t: getDictionary(lang) };
}
