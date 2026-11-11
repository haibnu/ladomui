'use client';

import { useState } from 'react';
import { IconFolder, IconHome, IconList, IconProfile, IconReport, IconSetting } from '@ladom/icons';
import { AppSidebar, AppSidebarItem, AppSidebarSection } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { collapsed: 'Collapsed', badges: 'Badge', header: 'Header', footer: 'Footer', code: 'Code', main: 'Main', expand: 'Expand menu', collapse: 'Collapse menu', home: 'Home', reports: 'Reports', monthly: 'Monthly', yearly: 'Yearly', archive: 'Archive', y2025: '2025', y2024: '2024', files: 'Files', members: 'Members', audit: 'Audit log', workspace: 'Workspace', settings: 'Settings' },
  tr: { collapsed: 'Daraltılmış', badges: 'Badge', header: 'Başlık', footer: 'Alt kısım', code: 'Kod', main: 'Ana menü', expand: 'Menüyü genişlet', collapse: 'Menüyü daralt', home: 'Ana sayfa', reports: 'Raporlar', monthly: 'Aylık', yearly: 'Yıllık', archive: 'Arşiv', y2025: '2025', y2024: '2024', files: 'Dosyalar', members: 'Üyeler', audit: 'Denetim kaydı', workspace: 'Çalışma alanı', settings: 'Ayarlar' },
};

export function AppSidebarPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [collapsed, setCollapsed] = useState(false);
  const [badges, setBadges] = useState(true);
  const [header, setHeader] = useState(true);
  const [footer, setFooter] = useState(true);
  const [current, setCurrent] = useState('monthly');

  const item = (key: string, label: string, extra: Partial<Parameters<typeof AppSidebarItem>[0]> = {}) => (
    <AppSidebarItem
      key={key}
      href="#"
      label={label}
      current={current === key}
      onClick={(e) => {
        e.preventDefault();
        setCurrent(key);
      }}
      {...extra}
    />
  );

  const code = `import { AppSidebar, AppSidebarItem, AppSidebarSection } from '@ladom/ui/pro';\n\nconst [collapsed, setCollapsed] = useState(${collapsed});\n\n<AppSidebar\n  aria-label="Main"${header ? '\n  header={<Logo />}' : ''}\n  collapsed={collapsed}\n  onCollapsedChange={setCollapsed}${footer ? '\n  footer={\n    <AppSidebarSection>\n      <AppSidebarItem href="/settings" icon={<IconSetting />} label="Settings" />\n    </AppSidebarSection>\n  }' : ''}\n>\n  <AppSidebarSection>\n    <AppSidebarItem href="/" icon={<IconHome />} label="Home" />\n    <AppSidebarItem icon={<IconReport />} label="Reports"${badges ? ' badge={3}' : ''}>\n      <AppSidebarItem href="/reports/monthly" label="Monthly" current />\n      <AppSidebarItem href="/reports/yearly" label="Yearly" />\n      <AppSidebarItem label="Archive">\n        <AppSidebarItem href="/reports/2025" label="2025" />\n      </AppSidebarItem>\n    </AppSidebarItem>\n  </AppSidebarSection>\n</AppSidebar>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ padding: 0, alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', blockSize: 480 }}>
          <AppSidebar
            aria-label={c.main}
            header={header ? <strong>Acme</strong> : undefined}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            expandLabel={c.expand}
            collapseLabel={c.collapse}
            footer={footer ? <AppSidebarSection>{item('settings', c.settings, { icon: <IconSetting /> })}</AppSidebarSection> : undefined}
          >
            <AppSidebarSection>
              {item('home', c.home, { icon: <IconHome /> })}
              <AppSidebarItem label={c.reports} icon={<IconReport />} badge={badges ? 3 : undefined}>
                {item('monthly', c.monthly)}
                {item('yearly', c.yearly)}
                <AppSidebarItem label={c.archive}>
                  {item('2025', c.y2025)}
                  {item('2024', c.y2024)}
                </AppSidebarItem>
              </AppSidebarItem>
              {item('files', c.files, { icon: <IconFolder /> })}
            </AppSidebarSection>
            <AppSidebarSection title={c.workspace}>
              {item('members', c.members, { icon: <IconProfile /> })}
              {item('audit', c.audit, { icon: <IconList />, disabled: true })}
            </AppSidebarSection>
          </AppSidebar>
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.collapsed} checked={collapsed} onChange={setCollapsed} />
        <ControlCheck label={c.badges} checked={badges} onChange={setBadges} />
        <ControlCheck label={c.header} checked={header} onChange={setHeader} />
        <ControlCheck label={c.footer} checked={footer} onChange={setFooter} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
