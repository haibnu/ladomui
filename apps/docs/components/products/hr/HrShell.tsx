'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  IconAnalytics,
  IconContacts,
  IconCurrencyTl,
  IconDashboard,
  IconDateRange,
  IconDateTime,
  IconNotification,
  IconSearch,
  IconSetting,
  IconTime,
  IconLead,
  IconReportChart,
  IconTransactions,
} from '@ladom/icons';
import { Badge, ToastProvider } from '@ladom/ui';
import { AppShell, AppSidebar, AppSidebarItem, AppSidebarSection } from '@ladom/ui/pro';
import { href } from '@/i18n';
import { useLocale } from '../../useLocale';
import { Logo } from '../../Logo';
import { HR_COPY } from './copy';
import { HrHeaderSlots } from './HrHeader';
import { HrSearch } from './HrSearch';
import { LEAVES, employee } from './data';
import styles from './hr.module.css';

const PAGES = [
  { key: 'dashboard', path: '', icon: IconDashboard },
  { key: 'employees', path: '/employees', icon: IconContacts },
  { key: 'leave', path: '/leave', icon: IconDateRange },
  { key: 'calendar', path: '/calendar', icon: IconDateTime },
  { key: 'timesheet', path: '/timesheet', icon: IconTime },
  { key: 'payroll', path: '/payroll', icon: IconCurrencyTl },
  { key: 'reports', path: '/reports', icon: IconReportChart },
] as const;

const SOON = [IconAnalytics, IconLead, IconTransactions];

/** The HR demo app: an AppShell with an AppSidebar (a Drawer on phones) around each screen. The foot
 *  of the menu holds search (a Modal), notifications and settings above the signed-in person; the sticky
 *  header holds the screen's title (HrHeader) on the left and its actions on the right. */
export function HrShell({ children }: { children: ReactNode }) {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const pathname = usePathname();
  const base = href(lang, '/products/hr');
  const pending = LEAVES.filter((l) => l.status === 'pending').length;
  const me = employee('e14');
  const [collapsed, setCollapsed] = useState(false);
  const [titleSlot, setTitleSlot] = useState<HTMLElement | null>(null);
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);
  const [searching, setSearching] = useState(false);

  const menu = (drawer: boolean) => {
    const rail = !drawer && collapsed;
    return (
    <AppSidebar
      aria-label={c.nav.label}
      collapsible={!drawer}
      collapsed={rail}
      onCollapsedChange={setCollapsed}
      collapseLabel={c.nav.collapse}
      expandLabel={c.nav.expand}
      header={
        <span className={styles.brand}>
          <Logo className={styles.brandLogo} />
          <span className={styles.brandProduct}>{c.app}</span>
        </span>
      }
      collapsedHeader={<Logo className={styles.brandLogo} symbol />}
      account={{ name: me.name, subtitle: me.title[lang], status: true }}
      footer={
        <>
          <AppSidebarSection>
            <AppSidebarItem as="button" type="button" icon={<IconSearch />} label={c.nav.search} onClick={() => setSearching(true)} />
            <AppSidebarItem as="button" type="button" icon={<IconNotification />} label={c.nav.notifications} />
            <AppSidebarItem icon={<IconSetting />} label={c.nav.settings} disabled />
          </AppSidebarSection>
          {!rail && (
            <Badge className={styles.sample} tone="warning" size="small">
              {c.sample}
            </Badge>
          )}
        </>
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
  };

  return (
    <ToastProvider closeLabel={c.employees.close}>
      <HrHeaderSlots.Provider value={{ title: titleSlot, actions: actionsSlot }}>
        <AppShell
          offsetTop="var(--customize-bar-height)"
          menuLabel={c.nav.menu}
          closeLabel={c.employees.close}
          sidebar={({ drawer }) => menu(drawer)}
          headerStart={<div ref={setTitleSlot} className={styles.headerTitle} />}
          headerEnd={<div ref={setActionsSlot} className={styles.headerActions} />}
        >
          {children}
        </AppShell>
        <HrSearch
          open={searching}
          onClose={() => setSearching(false)}
          pages={PAGES.map((p) => ({ key: p.key, label: c.nav[p.key], to: base + p.path, icon: p.icon }))}
          employeesHref={`${base}/employees`}
        />
      </HrHeaderSlots.Provider>
    </ToastProvider>
  );
}
