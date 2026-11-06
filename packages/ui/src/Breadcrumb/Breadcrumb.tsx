'use client';

import { useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEventHandler, type ReactNode } from 'react';
import { IconArrowBottom, IconArrowTop, IconBack } from '@ladom/icons';
import { Button } from '../Button/Button';
import { Cell } from '../Cell/Cell';
import { Dropdown } from '../Dropdown/Dropdown';
import { useUnclipped } from '../Floating/useUnclipped';
import styles from './Breadcrumb.module.css';

// Figma: Components / Breadcrumb (node 4748:15272): a compact pill before the page title with a
// back button and a menu of the path (previous pages, then the current one, checked).
// 🕹 State: Hover and Focus are :hover and :focus-visible, Active is the open menu.
export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
  /** The path from the top; the last item is the current page. */
  items: BreadcrumbItem[];
  /** Back button action; hidden when omitted. */
  onBack?: () => void;
  backLabel?: string;
  menuLabel?: string;
  /** Opens the menu (docs, visual tests). */
  defaultOpen?: boolean;
};

export function Breadcrumb({ items, onBack, backLabel = 'Back', menuLabel = 'Path', defaultOpen = false, className, ...rest }: BreadcrumbProps) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useUnclipped(menu, open);
  const Arrow = open ? IconArrowTop : IconArrowBottom;

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) toggle.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const focusItem = (index: number) => {
    const all = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    all[(index + all.length) % all.length]?.focus();
  };

  const onMenuKey = (e: KeyboardEvent) => {
    const all = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const at = all.indexOf(document.activeElement as HTMLElement);
    const target = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: all.length - 1 }[e.key];
    if (target != null) {
      e.preventDefault();
      focusItem(target);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  return (
    <nav ref={root} aria-label={menuLabel} className={[styles.breadcrumb, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.pill}>
        {onBack && <Button variant="ghost" size="small" icon={IconBack} aria-label={backLabel} className={styles.back} onClick={onBack} />}
        <button
          ref={toggle}
          type="button"
          className={styles.toggle}
          data-open={open || undefined}
          aria-label={menuLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && !open) {
              e.preventDefault();
              setOpen(true);
              requestAnimationFrame(() => focusItem(0));
            }
          }}
        >
          <Arrow aria-hidden="true" />
        </button>
      </div>
      {open && (
        <Dropdown ref={menu} id={id} role="menu" aria-label={menuLabel} className={styles.menu} onKeyDown={onMenuKey}>
          {items.map((item, i) => {
            const current = i === items.length - 1;
            const cell = (
              <Cell size="small" selected={current} tabIndex={-1}>
                {item.label}
              </Cell>
            );
            return item.href && !current ? (
              <a key={i} role="menuitem" href={item.href} className={styles.link} onClick={item.onClick} tabIndex={-1}>
                {cell}
              </a>
            ) : (
              <div
                key={i}
                role="menuitem"
                aria-current={current ? 'page' : undefined}
                tabIndex={-1}
                className={styles.link}
                onClick={item.onClick}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), item.onClick?.(e as never))}
              >
                {cell}
              </div>
            );
          })}
        </Dropdown>
      )}
    </nav>
  );
}
