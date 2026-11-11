'use client';

import { useState } from 'react';
import { Breadcrumb } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { back: 'Back button', figma: 'Figma variant', code: 'Code', path: ['Projects', 'Ladom UI', 'Settings'], title: 'Settings', went: 'Went to' },
  tr: { back: 'Geri butonu', figma: 'Figma varyantı', code: 'Kod', path: ['Projeler', 'Ladom UI', 'Ayarlar'], title: 'Ayarlar', went: 'Gidilen' },
};

/** Playground: the breadcrumb next to a page title, as in the Figma example. */
export function BreadcrumbDemo() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [back, setBack] = useState(true);
  const [went, setWent] = useState('');

  const items = c.path.map((label, i) => ({ label, onClick: i < c.path.length - 1 ? () => setWent(label) : undefined }));
  const code = `import { Breadcrumb } from '@ladom/ui';\n\n<Breadcrumb\n  items={[\n${c.path.map((l, i) => `    { label: '${l}'${i < c.path.length - 1 ? `, href: '/${l.toLowerCase().replace(/\s/g, '-')}'` : ''} },`).join('\n')}\n  ]}${back ? '\n  onBack={() => history.back()}' : ''}\n/>`;
  const figma = `🕹 State=Default | Hover | Focus | Active\nBack Button=${back ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ alignItems: 'flex-start', minBlockSize: 240, flexDirection: 'column', gap: 'var(--space-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-tiny)' }}>
          <Breadcrumb items={items} onBack={back ? () => setWent(c.path[c.path.length - 2]!) : undefined} backLabel={lang === 'tr' ? 'Geri' : 'Back'} menuLabel={lang === 'tr' ? 'Konum' : 'Path'} />
          <span style={{ font: 'var(--text-ui-text-bold)' }}>{c.title}</span>
        </div>
        {went && (
          <span style={{ font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>
            {c.went}: {went}
          </span>
        )}
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.back} checked={back} onChange={setBack} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
