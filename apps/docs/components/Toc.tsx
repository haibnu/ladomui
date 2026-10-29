'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CONTENT_CHANGE } from './docs/ViewSwitch';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

type Heading = { id: string; text: string; level: number };

// "On this page": the h2/h3 headings with an id inside the page content.
export function Toc() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    const scan = () => {
      observer.disconnect();
      const els = [...document.querySelectorAll<HTMLElement>('[data-doc-content] :is(h2, h3)[id]')];
      setHeadings(els.map((el) => ({ id: el.id, text: el.textContent ?? '', level: el.tagName === 'H2' ? 2 : 3 })));
      els.forEach((el) => observer.observe(el));
    };
    scan();
    // Component pages swap their sections when switching between the designer and developer views.
    window.addEventListener(CONTENT_CHANGE, scan);
    return () => {
      window.removeEventListener(CONTENT_CHANGE, scan);
      observer.disconnect();
    };
  }, [pathname]);

  if (!headings.length) return null;
  return (
    <nav className={styles.toc} aria-label={t.nav.onThisPage}>
      <p className={styles.navTitle}>{t.nav.onThisPage}</p>
      <ul className={styles.tocList}>
        {headings.map((h) => (
          <li key={h.id} data-level={h.level}>
            <a href={`#${h.id}`} className={styles.tocLink} aria-current={active === h.id ? 'location' : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
