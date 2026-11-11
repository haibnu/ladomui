'use client';

import { useState } from 'react';
import { IconContacts, IconCurrencyTl, IconDashboard, IconDateRange, IconNotification, IconSearch, IconSetting, IconTime } from '@ladom/icons';
import { Avatar, Button, Input } from '@ladom/ui';
import { AppShell, AppSidebar, AppSidebarItem, AppSidebarSection, Card, StatCard, SummaryList } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const PAGES = [
  { key: 'dashboard', icon: IconDashboard },
  { key: 'employees', icon: IconContacts },
  { key: 'leave', icon: IconDateRange },
  { key: 'timesheet', icon: IconTime },
  { key: 'payroll', icon: IconCurrencyTl },
] as const;

type PageKey = (typeof PAGES)[number]['key'];

const COPY = {
  en: {
    search: 'Search',
    actions: 'Header actions',
    collapsed: 'Collapsed menu',
    code: 'Code',
    main: 'Main',
    menu: 'Menu',
    close: 'Close',
    expand: 'Expand menu',
    collapse: 'Collapse menu',
    pages: { dashboard: 'Dashboard', employees: 'Employees', leave: 'Leave', timesheet: 'Timesheet', payroll: 'Payroll' } as Record<PageKey, string>,
    settings: 'Settings',
    searchPlaceholder: 'Search people',
    notifications: 'Notifications',
    headcount: 'Headcount',
    headcountNote: '+3 this month',
    onLeave: 'On leave today',
    onLeaveNote: '2 come back tomorrow',
    requests: 'Open requests',
    requestsNote: 'Leave and expenses',
    nextRun: 'Next payroll run',
    period: 'Period',
    periodValue: 'October 2026',
    payday: 'Payday',
    paydayValue: '31 October',
    employees: 'Employees',
    status: 'Status',
    statusValue: 'Waiting for approval',
  },
  tr: {
    search: 'Arama',
    actions: 'Başlık eylemleri',
    collapsed: 'Daraltılmış menü',
    code: 'Kod',
    main: 'Ana menü',
    menu: 'Menü',
    close: 'Kapat',
    expand: 'Menüyü genişlet',
    collapse: 'Menüyü daralt',
    pages: { dashboard: 'Genel bakış', employees: 'Çalışanlar', leave: 'İzinler', timesheet: 'Puantaj', payroll: 'Bordro' } as Record<PageKey, string>,
    settings: 'Ayarlar',
    searchPlaceholder: 'Kişi ara',
    notifications: 'Bildirimler',
    headcount: 'Çalışan sayısı',
    headcountNote: 'Bu ay +3',
    onLeave: 'Bugün izinde',
    onLeaveNote: '2 kişi yarın dönüyor',
    requests: 'Açık talepler',
    requestsNote: 'İzin ve masraf',
    nextRun: 'Sıradaki bordro',
    period: 'Dönem',
    periodValue: 'Ekim 2026',
    payday: 'Ödeme günü',
    paydayValue: '31 Ekim',
    employees: 'Çalışan',
    status: 'Durum',
    statusValue: 'Onay bekliyor',
  },
};

export function AppShellPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [search, setSearch] = useState(true);
  const [actions, setActions] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [current, setCurrent] = useState<PageKey>('dashboard');

  const sidebar = ({ drawer }: { drawer: boolean }) => (
    <AppSidebar
      aria-label={c.main}
      header={<strong>Acme HR</strong>}
      collapsible={!drawer}
      collapsed={drawer ? false : collapsed}
      onCollapsedChange={setCollapsed}
      expandLabel={c.expand}
      collapseLabel={c.collapse}
      footer={
        <AppSidebarSection>
          <AppSidebarItem icon={<IconSetting />} label={c.settings} disabled />
        </AppSidebarSection>
      }
    >
      <AppSidebarSection>
        {PAGES.map((p) => {
          const Icon = p.icon;
          return (
            <AppSidebarItem
              key={p.key}
              href="#"
              icon={<Icon />}
              label={c.pages[p.key]}
              badge={p.key === 'leave' ? 4 : undefined}
              current={current === p.key}
              onClick={(e) => {
                e.preventDefault();
                setCurrent(p.key);
              }}
            />
          );
        })}
      </AppSidebarSection>
    </AppSidebar>
  );

  const code = `import { AppShell, AppSidebar } from '@ladom/ui/pro';\n\n<AppShell\n  offsetTop="64px"\n  menuLabel="Menu"\n  sidebar={({ drawer }) => (\n    <AppSidebar aria-label="Main" collapsible={!drawer} collapsed={!drawer && collapsed} onCollapsedChange={setCollapsed}>\n      …\n    </AppSidebar>\n  )}\n  headerStart={${search ? '<Input size="small" iconLeft={<IconSearch />} placeholder="Search people" aria-label="Search people" />' : `<strong>${COPY.en.pages[current]}</strong>`}}${actions ? `\n  headerEnd={\n    <>\n      <Button variant="ghost" tone="secondary" icon={IconNotification} aria-label="Notifications" />\n      <Avatar size="small" name="Nazlı Güneş" />\n    </>\n  }` : ''}\n>\n  <Dashboard />\n</AppShell>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ placeItems: 'stretch', padding: 'var(--space-medium)' }}>
        <div style={{ blockSize: 'calc(5 * var(--grid-column-1))', overflow: 'auto', border: 'var(--border)', borderRadius: 'var(--radius-card)' }}>
          <AppShell
            menuLabel={c.menu}
            closeLabel={c.close}
            sidebar={sidebar}
            headerStart={search ? <Input size="small" iconLeft={<IconSearch />} placeholder={c.searchPlaceholder} aria-label={c.searchPlaceholder} /> : <strong>{c.pages[current]}</strong>}
            headerEnd={
              actions ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-tiny)', paddingInlineEnd: 'var(--space-container)' }}>
                  <Button variant="ghost" tone="secondary" icon={IconNotification} aria-label={c.notifications} />
                  <Avatar size="small" name="Nazlı Güneş" />
                </span>
              ) : undefined
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--grid-column-2), 1fr))', gap: 'var(--space-medium)' }}>
              <StatCard label={c.headcount} value="48" note={c.headcountNote} />
              <StatCard label={c.onLeave} value="5" note={c.onLeaveNote} />
              <StatCard label={c.requests} value="7" note={c.requestsNote} />
            </div>
            <Card title={c.nextRun}>
              <SummaryList
                layout="grid"
                items={[
                  { key: 'period', label: c.period, value: c.periodValue },
                  { key: 'payday', label: c.payday, value: c.paydayValue },
                  { key: 'employees', label: c.employees, value: '48' },
                  { key: 'status', label: c.status, value: c.statusValue },
                ]}
              />
            </Card>
          </AppShell>
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.search} checked={search} onChange={setSearch} />
        <ControlCheck label={c.actions} checked={actions} onChange={setActions} />
        <ControlCheck label={c.collapsed} checked={collapsed} onChange={setCollapsed} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
