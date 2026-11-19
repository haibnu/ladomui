'use client';

import { useRouter } from 'next/navigation';
import { useState, type ComponentType, type KeyboardEvent } from 'react';
import { IconSearch } from '@ladom/icons';
import { Avatar, Button, Cell, EmptyState, Input, Modal } from '@ladom/ui';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { EMPLOYEES } from './data';
import styles from './hr.module.css';

export type HrSearchPage = { key: string; label: string; to: string; icon: ComponentType };

/** The search button of the header: a Modal that finds people and pages as you type. A person opens
 *  their profile on the Employees screen (?id=). */
export function HrSearch({ pages, employeesHref }: { pages: HrSearchPage[]; employeesHref: string }) {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = query.trim().toLocaleLowerCase(lang);
  const has = (text: string) => text.toLocaleLowerCase(lang).includes(q);
  const foundPages = pages.filter((p) => !q || has(p.label));
  const foundPeople = EMPLOYEES.filter((e) => !q || has(e.name) || has(e.title[lang])).slice(0, q ? 8 : 5);

  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const go = (to: string) => {
    close();
    router.push(to);
  };
  // The results are buttons: Enter and Space press them.
  const press = (to: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: () => go(to),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(to);
      }
    },
  });

  return (
    <>
      <Button variant="ghost" tone="secondary" icon={IconSearch} aria-label={c.nav.search} onClick={() => setOpen(true)} />
      <Modal open={open} onClose={close} title={c.nav.search} closeLabel={c.employees.close}>
        <div className={styles.searchBody}>
          <Input type="search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.nav.searchPlaceholder} aria-label={c.nav.searchPlaceholder} />
          {foundPages.length === 0 && foundPeople.length === 0 ? (
            <EmptyState size="small" icon={<IconSearch />} title={c.nav.searchEmpty} />
          ) : (
            <>
              {foundPages.length > 0 && (
                <div className={styles.searchGroup}>
                  <p className={styles.rowsTitle}>{c.nav.searchPages}</p>
                  {foundPages.map((p) => {
                    const Icon = p.icon;
                    return (
                      <Cell key={p.key} size="small" iconLeft={<Icon />} {...press(p.to)}>
                        {p.label}
                      </Cell>
                    );
                  })}
                </div>
              )}
              {foundPeople.length > 0 && (
                <div className={styles.searchGroup}>
                  <p className={styles.rowsTitle}>{c.nav.searchPeople}</p>
                  {foundPeople.map((e) => (
                    <Cell key={e.id} size="small" avatar={<Avatar size="tiny" name={e.name} />} subtitle={e.title[lang]} {...press(`${employeesHref}?id=${e.id}`)}>
                      {e.name}
                    </Cell>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
