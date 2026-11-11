'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  IconAnalytics,
  IconContacts,
  IconCurrencyTl,
  IconDashboard,
  IconDateRange,
  IconNotification,
  IconSearch,
  IconSetting,
  IconTime,
  IconLead,
  IconTransactions,
} from '@ladom/icons';
import { Avatar, Badge, Button, Input, ToastProvider } from '@ladom/ui';
import { AppShell, AppSidebar, AppSidebarItem, AppSidebarSection } from '@ladom/ui/pro';
import { href } from '@/i18n';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { COMPANY, LEAVES } from './data';
import styles from './hr.module.css';

const PAGES = [
  { key: 'dashboard', path: '', icon: IconDashboard },
  { key: 'employees', path: '/employees', icon: IconContacts },
  { key: 'leave', path: '/leave', icon: IconDateRange },
  { key: 'timesheet', path: '/timesheet', icon: IconTime },
  { key: 'payroll', path: '/payroll', icon: IconCurrencyTl },
] as const;

// The docs TopBar above the demo: the Customize key, its padding and the line under it.
const TOP_BAR = 'calc(var(--space-xxlarge) + 3px + 2 * var(--space-small) + var(--border-width))';

const SOON = [IconAnalytics, IconLead, IconTransactions];

/** The HR demo app: an AppShell with an AppSidebar (a Drawer on phones) around each screen. */
export function HrShell({ children }: { children: ReactNode }) {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const pathname = usePathname();
  const base = href(lang, '/products/hr');
  const pending = LEAVES.filter((l) => l.status === 'pending').length;

  const menu = (collapsible: boolean) => (
    <AppSidebar
      aria-label={c.nav.label}
      collapsible={collapsible}
      collapseLabel={c.nav.collapse}
      expandLabel={c.nav.expand}
      header={
        <span className={styles.brand}>
          <Avatar size="small" name={COMPANY} />
          <span className={styles.brandText}>
            <strong>{COMPANY}</strong>
            <span>{c.app}</span>
          </span>
        </span>
      }
      footer={
        <AppSidebarSection>
          <AppSidebarItem icon={<IconSetting />} label={c.nav.settings} disabled />
        </AppSidebarSection>
      }
    >
      <AppSidebarSection>
        {PAGES.map((p) => {
          const Icon = p.icon;
          const to = base + p.path;
          return <AppSidebarItem key={p.key} as={Link} href={to} icon={<Icon />} label={c.nav[p.key]} badge={p.key === 'leave' ? pending : undefined} current={pathname === to} />;
        })}
      </AppSidebarSection>
      <AppSidebarSection title={c.nav.company}>
        {c.nav.soonItems.map((label, i) => {
          const Icon = SOON[i]!;
          return <AppSidebarItem key={label} icon={<Icon />} label={label} badge={c.nav.soon} disabled />;
        })}
      </AppSidebarSection>
    </AppSidebar>
  );

  return (
    <ToastProvider closeLabel={c.employees.close}>
      <AppShell
        offsetTop={TOP_BAR}
        menuLabel={c.nav.menu}
        closeLabel={c.employees.close}
        sidebar={({ drawer }) => menu(!drawer)}
        headerStart={<Input className={styles.search} size="small" iconLeft={<IconSearch />} placeholder={c.nav.search} aria-label={c.nav.search} />}
        headerEnd={
          <span className={styles.headerEnd}>
            <Badge className={styles.sample} tone="warning" size="small">
              {c.sample}
            </Badge>
            <Button variant="ghost" tone="secondary" icon={IconNotification} aria-label={c.nav.notifications} />
            <Avatar size="small" name="Nazlı Güneş" status />
          </span>
        }
      >
        {children}
      </AppShell>
    </ToastProvider>
  );
}
