'use client';

import { usePathname } from 'next/navigation';
import { changelogOf } from './changelogEntries';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

const REPO = 'https://github.com/haibnu/ladomui/pull/';

/** The history of a component or molecule, at the bottom of its page. */
export function Changelog() {
  const pathname = usePathname();
  const { lang, t } = useLocale();
  const entries = changelogOf(pathname);
  if (!entries?.length) return null;
  const format = new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeZone: 'UTC' });
  return (
    <>
      <h2 id="changelog">{t.changelog.title}</h2>
      <ol className={styles.changelog}>
        {entries.map((e, i) => (
          <li key={i}>
            <time className={styles.changelogDate} dateTime={e.date}>
              {format.format(new Date(`${e.date}T00:00:00Z`))}
            </time>
            <p className={styles.changelogText}>
              {e[lang]}
              {e.pr != null && (
                <a className={styles.changelogPr} href={`${REPO}${e.pr}`} target="_blank" rel="noreferrer">
                  {t.changelog.pr} #{e.pr}
                </a>
              )}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
