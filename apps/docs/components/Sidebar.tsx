'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNav, type NavItem } from './nav';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { lang, t } = useLocale();
  const nav = getNav(lang);
  return (
    <nav className={styles.sidebarNav} aria-label={t.topBar.docs}>
      {nav.map((section) => (
        <div key={section.title} className={styles.navSection}>
          <p className={styles.navTitle}>{section.title}</p>
          <ul className={styles.navList}>
            {section.items.map((item) => (
              <li key={item.title}>
                <NavEntry item={item} current={pathname} onNavigate={onNavigate} soon={t.nav.soon} />
                {item.children && (
                  <ul className={styles.navSubList}>
                    {item.children.map((child) => (
                      <li key={child.title}>
                        <NavEntry item={child} current={pathname} onNavigate={onNavigate} soon={t.nav.soon} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NavEntry({ item, current, onNavigate, soon }: { item: NavItem; current: string; onNavigate?: () => void; soon: string }) {
  if (!item.href)
    return (
      <span className={styles.navLink} aria-disabled="true">
        {item.title}
        {item.soon && <span className={styles.soon}>{soon}</span>}
      </span>
    );
  return (
    <Link href={item.href} className={styles.navLink} aria-current={current === item.href ? 'page' : undefined} onClick={onNavigate}>
      {item.title}
      {item.pro && <span className={styles.pro}>Pro</span>}
    </Link>
  );
}
