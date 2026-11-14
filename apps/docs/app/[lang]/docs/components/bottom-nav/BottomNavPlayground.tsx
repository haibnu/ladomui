'use client';

import { useState } from 'react';
import { IconHome, IconMessage, IconNotification, IconProfile, IconSearch } from '@ladom/icons';
import { BottomNav, BottomNavItem, Button, ToastProvider, useToast } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';
import local from './bottomNav.module.css';

const COPY = {
  en: {
    items: 'Items',
    badges: 'Badges',
    pinned: 'Pin to the screen',
    toast: 'Show a toast',
    toastTitle: 'Message sent',
    code: 'Code',
    main: 'Main',
    pages: ['Home', 'Search', 'Messages', 'Alerts', 'Profile'],
    pinnedNote: 'The bar is at the bottom of this window now. Show a toast: it opens above the bar.',
    content: 'Page content scrolls behind the bar.',
  },
  tr: {
    items: 'Öğeler',
    badges: 'Badge’ler',
    pinned: 'Ekrana sabitle',
    toast: 'Toast göster',
    toastTitle: 'Mesaj gönderildi',
    code: 'Kod',
    main: 'Ana menü',
    pages: ['Ana sayfa', 'Ara', 'Mesajlar', 'Bildirimler', 'Profil'],
    pinnedNote: 'Bar şimdi bu pencerenin altında. Bir toast gösterin: barın üstünde açılır.',
    content: 'Sayfa içeriği barın arkasında kayar.',
  },
};

const ICONS = [IconHome, IconSearch, IconMessage, IconNotification, IconProfile];
const PATHS = ['/', '/search', '/messages', '/alerts', '/profile'];
const ICON_NAMES = ['IconHome', 'IconSearch', 'IconMessage', 'IconNotification', 'IconProfile'];

function Demo() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const { toast } = useToast();
  const [count, setCount] = useState<'3' | '4' | '5'>('4');
  const [badges, setBadges] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [current, setCurrent] = useState(0);
  const n = Number(count);

  const nav = (
    <BottomNav aria-label={c.main} position={pinned ? 'fixed' : 'static'}>
      {ICONS.slice(0, n).map((Icon, i) => (
        <BottomNavItem
          key={i}
          href="#"
          icon={<Icon />}
          badge={badges ? (i === 2 ? 3 : i === 3 ? true : undefined) : undefined}
          current={current === i}
          onClick={(e) => {
            e.preventDefault();
            setCurrent(i);
          }}
        >
          {c.pages[i]}
        </BottomNavItem>
      ))}
    </BottomNav>
  );

  const code = `<BottomNav aria-label="Main"${pinned ? '' : ' position="static"'}>\n${PATHS.slice(0, n)
    .map((p, i) => {
      const icon = ICON_NAMES[i];
      const badge = badges && i === 2 ? ' badge={3}' : badges && i === 3 ? ' badge' : '';
      return `  <BottomNavItem href="${p}" icon={<${icon} />}${badge}${i === 0 ? ' current' : ''}>${COPY.en.pages[i]}</BottomNavItem>`;
    })
    .join('\n')}\n</BottomNav>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div className={local.phone}>
          <div className={local.screen}>
            {pinned ? <p className={local.note}>{c.pinnedNote}</p> : Array.from({ length: 6 }, (_, i) => <div key={i} className={local.block} />)}
          </div>
          {!pinned && nav}
        </div>
        {pinned && nav}
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.items} value={count} options={['3', '4', '5'] as const} onChange={setCount} />
        <ControlCheck label={c.badges} checked={badges} onChange={setBadges} />
        <ControlCheck label={c.pinned} checked={pinned} onChange={setPinned} />
        <Button size="small" tone="secondary" onClick={() => toast({ title: c.toastTitle, tone: 'success' })}>
          {c.toast}
        </Button>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}

export function BottomNavPlayground() {
  return (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  );
}
