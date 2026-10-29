'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

// The same page in the other language. A full language selector comes later.
export function LanguageLink() {
  const { lang, t } = useLocale();
  const pathname = usePathname();
  const other = locales.find((l) => l !== lang)!;
  const target = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), `/${other}`);
  return (
    <Link href={target} className={`${styles.topLink} ${styles.langLink}`} hrefLang={other} lang={other} title={t.topBar.otherLanguage}>
      {other.toUpperCase()}
    </Link>
  );
}
