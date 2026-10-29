'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav } from './nav';
import styles from './shell.module.css';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className={styles.sidebarNav} aria-label="Documentation">
      {nav.map((section) => (
        <div key={section.title} className={styles.navSection}>
          <p className={styles.navTitle}>{section.title}</p>
          <ul className={styles.navList}>
            {section.items.map((item) =>
              item.href ? (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={styles.navLink}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    {item.title}
                  </Link>
                </li>
              ) : (
                <li key={item.title}>
                  <span className={styles.navLink} aria-disabled="true">
                    {item.title}
                    {item.soon && <span className={styles.soon}>Soon</span>}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}
