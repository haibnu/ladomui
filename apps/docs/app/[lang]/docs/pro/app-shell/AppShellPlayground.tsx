'use client';

import { useState } from 'react';
import { IconContacts, IconCurrencyTl, IconDashboard, IconDateRange, IconNotification, IconSearch, IconSetting, IconTime } from '@ladom/icons';
import { Cell, Input, Modal } from '@ladom/ui';
import { AppShell, AppSidebar, AppSidebarItem, AppSidebarSection, Card, PageHeader, StatCard } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import { FullscreenStage } from '@/components/docs/FullscreenStage';
import { Logo } from '@/components/Logo';
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
    actions: 'Notifications and account',
    collapsed: 'Collapsed menu',
    code: 'Code',
    main: 'Main',
    menu: 'Menu',
    close: 'Close',
    expand: 'Expand menu',
    collapse: 'Collapse menu',
    pages: { dashboard: 'Dashboard', employees: 'Employees', leave: 'Leave', timesheet: 'Timesheet', payroll: 'Payroll' } as Record<PageKey, string>,
    settings: 'Settings',
    searchPlaceholder: 'Search pages',
    searchTitle: 'Search',
    notifications: 'Notifications',
    role: 'HR Manager',
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
    actions: 'Bildirimler ve hesap',
    collapsed: 'Daraltılmış menü',
    code: 'Kod',
    main: 'Ana menü',
    menu: 'Menü',
    close: 'Kapat',
    expand: 'Menüyü genişlet',
    collapse: 'Menüyü daralt',
    pages: { dashboard: 'Genel bakış', employees: 'Çalışanlar', leave: 'İzinler', timesheet: 'Puantaj', payroll: 'Bordro' } as Record<PageKey, string>,
    settings: 'Ayarlar',
    searchPlaceholder: 'Sayfa ara',
    searchTitle: 'Ara',
    notifications: 'Bildirimler',
    role: 'İK Müdürü',
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
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const found = PAGES.filter((p) => c.pages[p.key].toLocaleLowerCase(lang).includes(query.trim().toLocaleLowerCase(lang)));
  const closeSearch = () => {
    setSearching(false);
    setQuery('');
  };

  const sidebar = ({ drawer }: { drawer: boolean }) => (
    <AppSidebar
      aria-label={c.main}
      header={
        <span className={styles.sidebarBrand}>
          <Logo className={styles.sidebarLogo} />
          <strong className={styles.sidebarProduct}>HR</strong>
        </span>
      }
      collapsedHeader={<Logo className={styles.sidebarLogo} symbol />}
      collapsible={!drawer}
      collapsed={drawer ? false : collapsed}
      onCollapsedChange={setCollapsed}
      expandLabel={c.expand}
      collapseLabel={c.collapse}
      account={actions ? { name: 'Nazlı Güneş', subtitle: c.role, status: true } : undefined}
      footer={
        <AppSidebarSection>
          {search && <AppSidebarItem as="button" type="button" icon={<IconSearch />} label={c.searchTitle} onClick={() => setSearching(true)} />}
          {actions && <AppSidebarItem as="button" type="button" icon={<IconNotification />} label={c.notifications} />}
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

  const sidebarProps = actions ? `\n      account={{ name: 'Nazlı Güneş', subtitle: 'HR Manager', status: true }}` : '';
  const footParts = [
    search ? '          <AppSidebarItem as="button" type="button" icon={<IconSearch />} label="Search" onClick={openSearch} />' : '',
    actions ? '          <AppSidebarItem as="button" type="button" icon={<IconNotification />} label="Notifications" />' : '',
    '          <AppSidebarItem href="/settings" icon={<IconSetting />} label="Settings" />',
  ];
  const footer = `\n      footer={\n        <AppSidebarSection>\n${footParts.filter(Boolean).join('\n')}\n        </AppSidebarSection>\n      }`;
  const code = `import { AppShell, AppSidebar, PageHeader } from '@ladom/ui/pro';\n\n<AppShell\n  menuLabel="Menu"\n  sidebar={({ drawer }) => (\n    <AppSidebar\n      aria-label="Main"\n      header={<Logo />}\n      collapsedHeader={<LogoSymbol />}${sidebarProps}${footer}\n      collapsible={!drawer}\n      collapsed={!drawer && collapsed}\n      onCollapsedChange={setCollapsed}\n    >\n      …\n    </AppSidebar>\n  )}\n  headerStart={<PageHeader title="${COPY.en.pages[current]}" />}\n>\n  <Dashboard />\n</AppShell>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ placeItems: 'stretch', padding: 'var(--space-medium)' }}>
        <FullscreenStage style={{ blockSize: 'calc(5 * var(--grid-column-1))' }}>
          <AppShell
            menuLabel={c.menu}
            closeLabel={c.close}
            sidebar={sidebar}
            headerStart={<PageHeader title={c.pages[current]} style={{ paddingInline: 0 }} />}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--grid-column-2), 1fr))', gap: 'var(--space-medium)' }}>
              <StatCard label={c.headcount} value="48" note={c.headcountNote} />
              <StatCard label={c.onLeave} value="5" note={c.onLeaveNote} />
              <StatCard label={c.requests} value="7" note={c.requestsNote} />
            </div>
            <Card title={c.nextRun}>
              {[
                { key: 'period', label: c.period, value: c.periodValue },
                { key: 'payday', label: c.payday, value: c.paydayValue },
                { key: 'employees', label: c.employees, value: '48' },
                { key: 'status', label: c.status, value: c.statusValue },
              ].map((r) => (
                <Cell key={r.key} size="small" subtitle={r.label}>
                  {r.value}
                </Cell>
              ))}
            </Card>
          </AppShell>
        </FullscreenStage>
        <Modal open={searching} onClose={closeSearch} title={c.searchTitle} closeLabel={c.close}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-medium)' }}>
            <Input type="search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.searchPlaceholder} aria-label={c.searchPlaceholder} />
            <div>
              {found.map((p) => {
                const Icon = p.icon;
                return (
                  <Cell
                    key={p.key}
                    size="small"
                    iconLeft={<Icon />}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setCurrent(p.key);
                      closeSearch();
                    }}
                  >
                    {c.pages[p.key]}
                  </Cell>
                );
              })}
            </div>
          </div>
        </Modal>
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
