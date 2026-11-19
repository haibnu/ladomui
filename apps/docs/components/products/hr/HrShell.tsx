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
  IconSetting,
  IconTime,
  IconLead,
  IconReportChart,
  IconTransactions,
} from '@ladom/icons';
import { Badge, Button, ToastProvider } from '@ladom/ui';
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

/** The HR demo app: an AppShell with an AppSidebar (a Drawer on phones) around each screen. The
 *  signed-in person sits at the foot of the menu; the sticky header holds the screen's title (HrHeader)
 *  on the left, and its actions, the search button (a Modal) and the notifications on the right. */
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
          headerEnd={
            <>
              <div ref={setActionsSlot} className={styles.headerActions} />
              <span className={styles.headerTools}>
                <HrSearch pages={PAGES.map((p) => ({ key: p.key, label: c.nav[p.key], to: base + p.path, icon: p.icon }))} employeesHref={`${base}/employees`} />
                <Button variant="ghost" tone="secondary" icon={IconNotification} aria-label={c.nav.notifications} />
              </span>
            </>
          }
        >
          {children}
        </AppShell>
      </HrHeaderSlots.Provider>
    </ToastProvider>
  );
}
