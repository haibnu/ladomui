'use client';

import { useState } from 'react';
import { AppHeader, Avatar, Breadcrumb, Button, Input, PageHeader, PublicHeader, Segment, Tabs, Tooltip } from '@ladom/ui';
import { IconEdit, IconInfo, IconShare } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Kind = 'app' | 'public';
const COPY = {
  en: {
    kind: 'Bar', left: 'Left elements', back: 'Back button', breadcrumb: 'Breadcrumb', info: 'Info', subtitle: 'Subtext', actions: 'Actions', search: 'Center search', right: 'Right elements', tabs: 'Tabs below', edit: 'Inline edit', large: 'Large title',
    pub: 'Type', figma: 'Figma variant', code: 'Code', title: 'Reports', section: 'Analytics', sub: '24 files', searchText: 'Search', create: 'New report', tabsItems: ['All', 'Shared', 'Archived'], login: 'Login to App',
    pubTypes: { logo: 'Public Logo', title: 'Public Page Title', login: 'Login', logged: 'Logged' },
  },
  tr: {
    kind: 'Çubuk', left: 'Sol öğeler', back: 'Geri butonu', breadcrumb: 'Breadcrumb', info: 'Info', subtitle: 'Alt metin', actions: 'Eylemler', search: 'Ortada arama', right: 'Sağ öğeler', tabs: 'Altta sekmeler', edit: 'Satır içi düzenleme', large: 'Büyük başlık',
    pub: 'Tip', figma: 'Figma varyantı', code: 'Kod', title: 'Raporlar', section: 'Analitik', sub: '24 dosya', searchText: 'Ara', create: 'Yeni rapor', tabsItems: ['Tümü', 'Paylaşılan', 'Arşiv'], login: 'Uygulamaya giriş',
    pubTypes: { logo: 'Public Logo', title: 'Public Page Title', login: 'Login', logged: 'Logged' },
  },
};

export function NavigationPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [kind, setKind] = useState<Kind>('app');
  const [pub, setPub] = useState<'logo' | 'title' | 'login' | 'logged'>('login');
  const [f, setF] = useState({ back: true, breadcrumb: false, info: true, subtitle: false, actions: true, search: true, right: true, tabs: false, edit: false, large: false });
  const [title, setTitle] = useState(c.title);
  const [draft, setDraft] = useState(c.title);
  const set = (k: keyof typeof f, v: boolean) => setF({ ...f, [k]: v });

  const pageHeader = (
    <PageHeader
      title={title}
      variant={f.large ? 'large' : 'default'}
      eyebrow={c.section}
      subtitle={f.subtitle ? c.sub : undefined}
      info={
        f.info ? (
          <Tooltip content={c.sub}>
            <span tabIndex={0} aria-label="Info" style={{ display: 'inline-flex' }}>
              <IconInfo />
            </span>
          </Tooltip>
        ) : undefined
      }
      onBack={f.back ? () => {} : undefined}
      breadcrumb={f.breadcrumb ? <Breadcrumb items={[{ label: c.section }, { label: title }]} /> : undefined}
      actions={
        f.actions ? (
          <>
            <Button tone="tertiary" icon={IconEdit} aria-label="Edit" onClick={() => set('edit', true)} />
            <Button tone="tertiary" icon={IconShare} aria-label="Share" />
          </>
        ) : undefined
      }
      edit={f.edit ? { value: draft, onChange: setDraft, onSave: () => (setTitle(draft), set('edit', false)), onCancel: () => (setDraft(title), set('edit', false)) } : undefined}
    />
  );
  const bar =
    kind === 'app' ? (
      <AppHeader
        border
        start={pageHeader}
        center={f.search ? <Input type="search" placeholder={c.searchText} aria-label={c.searchText} /> : undefined}
        end={
          f.right ? (
            <>
              <Segment aria-label="View" options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />
              <Button>{c.create}</Button>
            </>
          ) : undefined
        }
        bottom={f.tabs ? <Tabs aria-label="Filter" items={c.tabsItems.map((label, i) => ({ value: String(i), label }))} /> : undefined}
      />
    ) : (
      <PublicHeader
        title={pub === 'logo' ? undefined : c.title}
        logoPosition={pub === 'title' ? 'start' : 'center'}
        end={pub === 'login' ? <Button tone="tertiary">{c.login}</Button> : pub === 'logged' ? <Avatar size="small" name="Halil Nuroğlu" /> : undefined}
      />
    );

  const code =
    kind === 'app'
      ? `import { AppHeader, PageHeader } from '@ladom/ui';\n\n<AppHeader\n  border\n  start={<PageHeader title="${title}"${f.large ? ` variant="large" eyebrow="${c.section}"` : ''}${f.back ? ' onBack={goBack}' : ''}${f.info ? ' info' : ''}${f.subtitle ? ` subtitle="${c.sub}"` : ''}${f.actions ? ' actions={…}' : ''} />}${f.search ? '\n  center={<Input type="search" />}' : ''}${f.right ? '\n  end={<Button>…</Button>}' : ''}${f.tabs ? '\n  bottom={<Tabs items={…} />}' : ''}\n/>`
      : `import { PublicHeader } from '@ladom/ui';\n\n<PublicHeader${pub !== 'logo' ? ` title="${c.title}"` : ''}${pub === 'title' ? ' logoPosition="start"' : ''}${pub === 'login' ? ' end={<Button tone="tertiary">Login</Button>}' : pub === 'logged' ? ' end={<Avatar … />}' : ''} />`;
  const figma =
    kind === 'app'
      ? `App Header\nType=Default\nTab=${f.tabs ? 'True' : 'False'}\n\n_Left Elements\n🎛 Type=${f.edit ? 'Inline Edit' : f.large ? 'Large Title' : 'Default'}\nShow Back Button=${f.back}\nShow Breadcrumb=${f.breadcrumb}\nShow Info=${f.info}\nShow Subtitle=${f.subtitle}\nShow Actions=${f.actions}\n\n_Right Elements\n🎛 Type=Full Control`
      : `Public Page Navigation\n🎛 Type=${c.pubTypes[pub]}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ alignItems: 'flex-start', padding: 0, minBlockSize: 160, overflowX: 'auto' }}>
        <div style={{ inlineSize: '100%', minInlineSize: 900 }}>{bar}</div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.kind}
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            <option value="app">App Header</option>
            <option value="public">Public Page Navigation</option>
          </select>
        </label>
        {kind === 'public' ? (
          <label>
            {c.pub}
            <select value={pub} onChange={(e) => setPub(e.target.value as typeof pub)}>
              {Object.entries(c.pubTypes).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        ) : (
          (['large', 'back', 'breadcrumb', 'info', 'subtitle', 'actions', 'edit', 'search', 'right', 'tabs'] as const).map((k) => (
            <label key={k} className={styles.check}>
              <input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} /> {c[k]}
            </label>
          ))
        )}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
