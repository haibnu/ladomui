'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch, iconNames } from '@ladom/icons';
import { Input } from '@ladom/ui';
import meta from '@ladom/tokens/tokens.json';
import { getDictionary, href, type Locale } from '@/i18n';
import { getNav } from './nav';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

type Kind = 'Page' | 'Token' | 'Icon';
type Result = { kind: Kind; title: string; detail?: string; href: string; keywords?: string[] };

function buildIndex(lang: Locale): Result[] {
  const t = getDictionary(lang);
  return [
    ...getNav(lang).flatMap((s) => s.items.flatMap((i) => [i, ...(i.children ?? [])]).filter((i) => i.href).map((i) => ({ kind: 'Page' as const, title: i.title, detail: s.title, href: i.href!, keywords: i.keywords }))),
    ...meta.groups.flatMap((g) =>
      [...g.variables.map((v) => v.name), ...g.tokens.map((tk) => tk.name)].map((name) => ({
        kind: 'Token' as const,
        title: name,
        detail: t.groups[g.id]?.title ?? g.title,
        href: href(lang, `/docs/foundations/${g.id}#${name.slice(2)}`),
      })),
    ),
    ...iconNames.map((name) => ({ kind: 'Icon' as const, title: name, href: href(lang, `/docs/foundations/icons#icon-${name}`) })),
  ];
}

export function Search() {
  const router = useRouter();
  const { lang, t } = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const index = useMemo(() => buildIndex(lang), [lang]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.filter((r) => r.kind === 'Page');
    return index.filter((r) => r.title.toLowerCase().includes(q) || r.keywords?.some((k) => k.includes(q))).slice(0, 50);
  }, [query, index]);

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
      <button type="button" className={styles.searchButton} onClick={open} aria-label={t.search.label}>
        <IconSearch size={16} />
        <span className={styles.searchLabel}>{t.topBar.search}</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>
      <dialog ref={dialog} className={styles.searchDialog} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className={styles.searchInputRow}>
          <Input
            className={styles.searchInput}
            type="search"
            autoFocus
            placeholder={t.search.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            aria-label={t.search.label}
            clearLabel={t.icons.clear}
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>
        <ul className={styles.searchResults} role="listbox">
          {results.length === 0 && (
            <li className={styles.searchEmpty}>
              {t.search.empty} “{query}”
            </li>
          )}
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.href}`} role="option" aria-selected={i === active}>
              <button type="button" className={styles.searchResult} data-active={i === active || undefined} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                <span className={styles.searchKind}>{t.search.kinds[r.kind]}</span>
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
