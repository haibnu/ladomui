'use client';

import { useState } from 'react';
import { IconFolder, IconHome, IconList, IconProfile, IconReport, IconSetting } from '@ladom/icons';
import { Avatar, SidebarNav, SidebarNavItem, SidebarNavSection, TopNav, TopNavItem } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { kind: 'Menu', icons: 'Icons', badges: 'Badge', header: 'Header / brand', footer: 'Footer / actions', sections: 'Section titles', code: 'Code', main: 'Main', pages: ['Home', 'Reports', 'Files', 'Members', 'Audit log'], workspace: 'Workspace', settings: 'Settings' },
  tr: { kind: 'Menü', icons: 'İkonlar', badges: 'Badge', header: 'Başlık / marka', footer: 'Alt kısım / aksiyonlar', sections: 'Bölüm başlıkları', code: 'Kod', main: 'Ana menü', pages: ['Ana sayfa', 'Raporlar', 'Dosyalar', 'Üyeler', 'Denetim kaydı'], workspace: 'Çalışma alanı', settings: 'Ayarlar' },
};

const ICONS = [IconHome, IconReport, IconFolder, IconProfile, IconList];

export function NavMenuPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [kind, setKind] = useState<'sidebar' | 'top'>('sidebar');
  const [icons, setIcons] = useState(true);
  const [badges, setBadges] = useState(true);
  const [header, setHeader] = useState(true);
  const [footer, setFooter] = useState(true);
  const [sections, setSections] = useState(true);
  const [current, setCurrent] = useState(0);

  const item = (i: number, Item: typeof SidebarNavItem) => {
    const Icon = ICONS[i]!;
    return (
      <Item
        key={i}
        href="#"
        icon={icons ? <Icon /> : undefined}
        badge={badges && i === 1 ? 3 : undefined}
        current={current === i}
        disabled={i === 4}
        onClick={(e) => {
          e.preventDefault();
          setCurrent(i);
        }}
      >
        {c.pages[i]}
      </Item>
    );
  };
  const brand = <strong>Acme</strong>;

  const code =
    kind === 'sidebar'
      ? `<SidebarNav aria-label="Main"${header ? ' header={<Logo />}' : ''}${footer ? `\n  footer={
    <SidebarNavSection>
      <SidebarNavItem href="/settings"${icons ? ' icon={<IconSetting />}' : ''}>Settings</SidebarNavItem>
    </SidebarNavSection>
  }` : ''}>\n  <SidebarNavSection>\n    <SidebarNavItem href="/"${icons ? ' icon={<IconHome />}' : ''} current>Home</SidebarNavItem>\n    <SidebarNavItem href="/reports"${icons ? ' icon={<IconReport />}' : ''}${badges ? ' badge={3}' : ''}>Reports</SidebarNavItem>\n    <SidebarNavItem href="/files"${icons ? ' icon={<IconFolder />}' : ''}>Files</SidebarNavItem>\n  </SidebarNavSection>\n  <SidebarNavSection${sections ? ' title="Workspace"' : ''}>\n    <SidebarNavItem href="/members"${icons ? ' icon={<IconProfile />}' : ''}>Members</SidebarNavItem>\n  </SidebarNavSection>\n</SidebarNav>`
      : `<TopNav aria-label="Main"${header ? ' brand={<Logo />}' : ''}${footer ? ' actions={<Avatar name="Halil N" />}' : ''}>\n  <TopNavItem href="/"${icons ? ' icon={<IconHome />}' : ''} current>Home</TopNavItem>\n  <TopNavItem href="/reports"${icons ? ' icon={<IconReport />}' : ''}${badges ? ' badge={3}' : ''}>Reports</TopNavItem>\n  <TopNavItem href="/files"${icons ? ' icon={<IconFolder />}' : ''}>Files</TopNavItem>\n</TopNav>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ padding: 0, alignItems: 'stretch', justifyContent: 'stretch' }}>
        {kind === 'sidebar' ? (
          <div style={{ display: 'flex', inlineSize: '100%', blockSize: 440 }}>
            <div style={{ inlineSize: 260, flex: 'none' }}>
              <SidebarNav
                aria-label={c.main}
                header={header ? brand : undefined}
                footer={
                  footer ? (
                    <SidebarNavSection>
                      <SidebarNavItem href="#" icon={icons ? <IconSetting /> : undefined} onClick={(e) => e.preventDefault()}>
                        {c.settings}
                      </SidebarNavItem>
                    </SidebarNavSection>
                  ) : undefined
                }
              >
                <SidebarNavSection>{[0, 1, 2].map((i) => item(i, SidebarNavItem))}</SidebarNavSection>
                <SidebarNavSection title={sections ? c.workspace : undefined}>{[3, 4].map((i) => item(i, SidebarNavItem))}</SidebarNavSection>
              </SidebarNav>
            </div>
          </div>
        ) : (
          <div style={{ inlineSize: '100%', minInlineSize: 0, alignSelf: 'flex-start' }}>
            <TopNav aria-label={c.main} brand={header ? brand : undefined} actions={footer ? <Avatar size="small" name="Halil N" /> : undefined}>
              {[0, 1, 2, 3, 4].map((i) => item(i, TopNavItem))}
            </TopNav>
          </div>
        )}
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.kind} value={kind} options={['sidebar', 'top'] as const} onChange={setKind} />
        <ControlCheck label={c.icons} checked={icons} onChange={setIcons} />
        <ControlCheck label={c.badges} checked={badges} onChange={setBadges} />
        <ControlCheck label={c.header} checked={header} onChange={setHeader} />
        <ControlCheck label={c.footer} checked={footer} onChange={setFooter} />
        {kind === 'sidebar' && <ControlCheck label={c.sections} checked={sections} onChange={setSections} />}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
