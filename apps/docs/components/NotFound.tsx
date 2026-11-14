'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconArrowRight, IconHome, IconSearch, IconTourEducation } from '@ladom/icons';
import { Button, EmptyState } from '@ladom/ui';
import { getDictionary, href, isLocale, type Locale } from '@/i18n';
import { TopBar } from './TopBar';
import styles from './NotFound.module.css';

/** The 404 page. Shown for unmatched URLs (app/global-not-found.tsx) and for notFound() inside a
 *  page (app/[lang]/not-found.tsx). The language comes from the URL, else from the browser. */
export function NotFound({ fallback }: { fallback: Locale }) {
  const first = usePathname()?.split('/')[1] ?? '';
  const lang: Locale = isLocale(first) ? first : fallback;
  const t = getDictionary(lang).notFound;
  const router = useRouter();

  const links: [string, string][] = [
    [t.links.introduction, '/docs/introduction'],
    [t.links.installation, '/docs/installation'],
    [t.links.colors, '/docs/foundations/color'],
    [t.links.icons, '/docs/foundations/icons'],
  ];

  return (
    <div className={styles.page} lang={lang}>
      <TopBar lang={lang} />
      <main className={styles.main}>
        <h1 className={styles.srOnly}>404</h1>
        <EmptyState
          size="large"
          icon={<IconSearch />}
          title={t.heading}
          description={t.body}
          action={
            <div className={styles.actions}>
              <Button iconLeft={IconHome} onClick={() => router.push(href(lang, '/'))}>
                {t.home}
              </Button>
              <Button tone="secondary" iconLeft={IconTourEducation} onClick={() => router.push(href(lang, '/docs/introduction'))}>
                {t.docs}
              </Button>
            </div>
          }
        />
        <nav className={styles.popular} aria-label={t.popular}>
          <p className={styles.popularTitle}>{t.popular}</p>
          <ul>
            {links.map(([label, path]) => (
              <li key={path}>
                <Link href={href(lang, path)} className={styles.link}>
                  {label}
                  <IconArrowRight size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
