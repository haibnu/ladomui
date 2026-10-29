'use client';

import { useMemo, useState } from 'react';
import { iconNames, type IconName } from '@ladom/icons';
import { iconMeta, icons } from '@ladom/icons/all';
import styles from './page.module.css';

const componentName = (name: string) => `Icon${name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;

export function IconGallery() {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (name: IconName) => {
      const m = iconMeta[name];
      return !q || [name, m.tabler ?? '', m.figma].some((s) => s.toLowerCase().includes(q));
    };
    const byCategory = new Map<string, IconName[]>();
    for (const name of iconNames.filter(match)) {
      const category = iconMeta[name].category;
      byCategory.set(category, [...(byCategory.get(category) ?? []), name]);
    }
    return [...byCategory];
  }, [query]);

  return (
    <>
      <input
        className={styles.search}
        type="search"
        placeholder={`Search ${iconNames.length} icons`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search icons"
      />
      {groups.length === 0 && <p className={styles.empty}>No icons match “{query}”.</p>}
      {groups.map(([category, names]) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.heading}>
            {category} <span className={styles.count}>{names.length}</span>
          </h2>
          <ul className={styles.grid}>
            {names.map((name) => {
              const Icon = icons[name];
              const m = iconMeta[name];
              return (
                <li key={name} className={styles.tile} title={`${componentName(name)} · ${m.source === 'figma' ? 'custom (Figma)' : `tabler: ${m.tabler}`}`}>
                  <Icon size={24} />
                  <span className={styles.name}>{name}</span>
                  {m.source === 'figma' && <span className={styles.badge}>custom</span>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
