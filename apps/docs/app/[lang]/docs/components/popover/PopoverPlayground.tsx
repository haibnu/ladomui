'use client';

import { useState } from 'react';
import { Avatar, Button, Popover, type Placement } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { FIGMA_POSITION } from '../tooltip/positions';

const PLACEMENTS: Placement[] = ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];
const COPY = {
  en: { type: 'Type', placement: 'Placement', figma: 'Figma variant', code: 'Code', open: 'Details', title: 'Shared with 3 people', body: 'Everyone with the link can view this report.', name: 'Halil Nuroğlu', role: 'Owner of this report' },
  tr: { type: 'Tip', placement: 'Konum', figma: 'Figma varyantı', code: 'Kod', open: 'Ayrıntılar', title: '3 kişiyle paylaşıldı', body: 'Bağlantıya sahip herkes bu raporu görebilir.', name: 'Halil Nuroğlu', role: 'Raporun sahibi' },
};

export function PopoverPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [type, setType] = useState<'default' | 'html'>('default');
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [open, setOpen] = useState(true);

  const content =
    type === 'html' ? (
      <div style={{ display: 'flex', gap: 'var(--space-medium)', alignItems: 'center' }}>
        <Avatar size="xlarge" src="/avatars/2.svg" name={c.name} />
        <div>
          <div style={{ font: 'var(--text-ui-text-lead-bold)' }}>{c.name}</div>
          <div style={{ font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>{c.role}</div>
        </div>
      </div>
    ) : (
      c.body
    );
  const props = [type === 'default' && `title="${c.title}"`, placement !== 'bottom' && `placement="${placement}"`, 'open={open}', 'onOpenChange={setOpen}', `trigger={<Button>${c.open}</Button>}`].filter(Boolean);
  const code = `import { Button, Popover } from '@ladom/ui';\n\n<Popover${props.map((p) => `\n  ${p}`).join('')}\n>\n  ${type === 'html' ? '<ProfileCard />' : c.body}\n</Popover>`;
  const figma = `👉 Position=${FIGMA_POSITION[placement]}\n🎛 Type=${type === 'html' ? 'HTML' : 'Default'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ minBlockSize: 320 }}>
        <Popover
          trigger={<Button tone="secondary">{c.open}</Button>}
          title={type === 'default' ? c.title : undefined}
          placement={placement}
          open={open}
          onOpenChange={setOpen}
          closeLabel={lang === 'tr' ? 'Kapat' : 'Close'}
        >
          {content}
        </Popover>
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.type} value={type} options={['default', 'html'] as const} onChange={setType} />
        <ControlSelect label={c.placement} value={placement} options={PLACEMENTS} onChange={setPlacement} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
