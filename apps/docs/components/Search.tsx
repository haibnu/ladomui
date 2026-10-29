'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch, iconNames } from '@ladom/icons';
import meta from '@ladom/tokens/tokens.json';
import { nav } from './nav';
import styles from './shell.module.css';

type Result = { kind: 'Page' | 'Token' | 'Icon'; title: string; detail?: string; href: string };

const index: Result[] = [
  ...nav.flatMap((s) => s.items.filter((i) => i.href).map((i) => ({ kind: 'Page' as const, title: i.title, detail: s.title, href: i.href! }))),
  ...meta.groups.flatMap((g) =>
    [...g.variables.map((v) => v.name), ...g.tokens.map((t) => t.name)].map((name) => ({
      kind: 'Token' as const,
      title: name,
      detail: g.title,
      href: `/docs/foundations/${g.id}#${name.slice(2)}`,
    })),
  ),
  ...iconNames.map((name) => ({ kind: 'Icon' as const, title: name, href: `/docs/foundations/icons#icon-${name}` })),
];

export function Search() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.filter((r) => r.kind === 'Page');
    return index.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 50);
  }, [query]);

  const open = () => {
    setQuery('');
    setActive(0);
    dialog.current?.showModal();
  };
  const go = (r: Result) => {
    dialog.current?.close();
    router.push(r.href);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, results.length - 1));
    else if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, 0));
    else if (e.key === 'Enter' && results[active]) go(results[active]);
    else return;
    e.preventDefault();
  };

  return (
    <>
      <button type="button" className={styles.searchButton} onClick={open}>
        <IconSearch size={16} />
        <span className={styles.searchLabel}>Quick search…</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>
      <dialog ref={dialog} className={styles.searchDialog} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className={styles.searchInputRow}>
          <IconSearch size={20} />
          <input
            className={styles.searchInput}
            autoFocus
            placeholder="Search pages, tokens and icons"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            aria-label="Search"
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>
        <ul className={styles.searchResults} role="listbox">
          {results.length === 0 && <li className={styles.searchEmpty}>No results for “{query}”.</li>}
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.href}`} role="option" aria-selected={i === active}>
              <button type="button" className={styles.searchResult} data-active={i === active || undefined} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                <span className={styles.searchKind}>{r.kind}</span>
                <span className={styles.searchTitle}>{r.title}</span>
                {r.detail && <span className={styles.searchDetail}>{r.detail}</span>}
              </button>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
