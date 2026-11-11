import type { ReactNode } from 'react';
import { Changelog } from './Changelog';
import { ReadinessBadges } from './ReadinessBadges';
import styles from './shell.module.css';

export function DocPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <article className={styles.article}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description && <p className={styles.pageDescription}>{description}</p>}
        <ReadinessBadges />
      </header>
      <div data-doc-content className={styles.prose}>
        {children}
        <Changelog />
      </div>
    </article>
  );
}
