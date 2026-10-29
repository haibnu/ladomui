'use client';

import { useState } from 'react';
import { Alert, Button, type AlertTone } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const TONES: AlertTone[] = ['default', 'info', 'success', 'error', 'warning'];
const FIGMA_STYLE: Record<AlertTone, string> = { default: 'Default', info: 'Information', success: 'Success', error: 'Error', warning: 'Warning' };
const BUTTON_TONE = { default: 'tertiary', info: 'info', success: 'success', error: 'error', warning: 'warning' } as const;
const COPY = {
  en: { tone: 'Style', direction: 'Direction', description: 'Description', actions: 'CTA buttons', close: 'Close button', figma: 'Figma variant', code: 'Code', title: 'Your trial ends in 3 days', text: 'Add a payment method to keep your projects.', primary: 'Upgrade', secondary: 'Later', closed: 'Closed.', reopen: 'Show again' },
  tr: { tone: 'Stil', direction: 'Yön', description: 'Açıklama', actions: 'CTA butonları', close: 'Kapatma butonu', figma: 'Figma varyantı', code: 'Kod', title: 'Deneme süreniz 3 gün içinde bitiyor', text: 'Projelerinizi korumak için bir ödeme yöntemi ekleyin.', primary: 'Yükselt', secondary: 'Sonra', closed: 'Kapatıldı.', reopen: 'Yeniden göster' },
};

export function AlertPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [tone, setTone] = useState<AlertTone>('info');
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');
  const [description, setDescription] = useState(true);
  const [actions, setActions] = useState(true);
  const [close, setClose] = useState(true);
  const [closed, setClosed] = useState(false);

  const horizontal = direction === 'horizontal';
  const buttons = horizontal ? (
    <Button variant="ghost" size="small">
      {c.primary}
    </Button>
  ) : (
    <>
      <Button tone={BUTTON_TONE[tone]} size="small">
        {c.primary}
      </Button>
      <Button tone="tertiary" size="small">
        {c.secondary}
      </Button>
    </>
  );
  const props = [
    tone !== 'default' && `tone="${tone}"`,
    horizontal && 'direction="horizontal"',
    `title="${c.title}"`,
    description && `description="${c.text}"`,
    actions && 'actions={<Button size="small">…</Button>}',
    close && 'onClose={dismiss}',
  ].filter(Boolean);
  const code = `import { Alert } from '@ladom/ui';\n\n<Alert${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const figma = `Style=${FIGMA_STYLE[tone]}\n✈️ Direction=${horizontal ? 'Horizontal' : 'Vertical'}\nDescription=${description ? 'True' : 'False'}\nCTA Buttons=${actions ? 'True' : 'False'}\nClose Button=${close ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: '100%', maxInlineSize: horizontal ? 640 : 400 }}>
          {closed ? (
            <p style={{ margin: 0 }}>
              {c.closed} <button type="button" onClick={() => setClosed(false)}>{c.reopen}</button>
            </p>
          ) : (
            <Alert
              tone={tone}
              direction={direction}
              title={c.title}
              description={description ? c.text : undefined}
              actions={actions ? buttons : undefined}
              onClose={close ? () => setClosed(true) : undefined}
              closeLabel={lang === 'tr' ? 'Kapat' : 'Close'}
            />
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.tone}
          <select value={tone} onChange={(e) => setTone(e.target.value as AlertTone)}>
            {TONES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          {c.direction}
          <select value={direction} onChange={(e) => setDirection(e.target.value as 'vertical' | 'horizontal')}>
            <option>vertical</option>
            <option>horizontal</option>
          </select>
        </label>
        {(
          [
            [c.description, description, setDescription],
            [c.actions, actions, setActions],
            [c.close, close, setClose],
          ] as [string, boolean, (v: boolean) => void][]
        ).map(([label, v, set]) => (
          <label key={label} className={styles.check}>
            <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} /> {label}
          </label>
        ))}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
