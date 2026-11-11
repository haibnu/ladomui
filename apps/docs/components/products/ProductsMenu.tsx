'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { IconApps, IconArrowBottom } from '@ladom/icons';
import { Badge, Cell, Dropdown } from '@ladom/ui';
import { href } from '@/i18n';
import { useLocale } from '../useLocale';
import { PRODUCTS } from './products';
import styles from './products.module.css';

/** "Products" in the top bar, next to Customize: the industry demos, the first ones live, the rest soon. */
export function ProductsMenu() {
  const { lang, t } = useLocale();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={styles.menuRoot}>
      <button type="button" className={styles.menuButton} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}>
        {/* On phones the label gives way to an icon so the top bar fits. */}
        <IconApps size={20} className={styles.menuIcon} aria-hidden />
        <span className={styles.menuLabel}>{t.products.button}</span>
        <IconArrowBottom size={14} className={styles.menuArrow} aria-hidden />
      </button>
      {open && (
        <Dropdown id={id} className={styles.menu} aria-label={t.products.menuLabel}>
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const cell = (
              <Cell
                iconLeft={<Icon size={20} />}
                subtitle={p.path ? p.description[lang] : <span className={styles.soon}>{p.description[lang]}</span>}
                badgeRight={p.path ? undefined : <Badge size="tiny">{t.products.soon}</Badge>}
                aria-disabled={p.path ? undefined : true}
                className={p.path ? undefined : styles.soon}
              >
                {p.name[lang]}
              </Cell>
            );
            return p.path ? (
              <Link key={p.key} href={href(lang, p.path)} className={styles.menuLink} onClick={() => setOpen(false)}>
                {cell}
              </Link>
            ) : (
              <div key={p.key}>{cell}</div>
            );
          })}
          <Link href={href(lang, '/products')} className={styles.menuLink} onClick={() => setOpen(false)}>
            <Cell size="small">{t.products.all}</Cell>
          </Link>
        </Dropdown>
      )}
    </div>
  );
}
