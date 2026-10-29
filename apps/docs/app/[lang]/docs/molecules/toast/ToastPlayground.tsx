'use client';

import { useState } from 'react';
import { Button, Toast, ToastProvider, useToast, type ToastTone } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const TONES: ToastTone[] = ['default', 'info', 'success', 'error', 'warning'];
const FIGMA_STYLE: Record<ToastTone, string> = { default: 'Default', info: 'Information', success: 'Success', error: 'Error', warning: 'Warning' };
const COPY = {
  en: { tone: 'Style', device: 'Device', description: 'Description', actions: 'CTA buttons', figma: 'Figma variant', code: 'Code', title: 'Changes saved', text: 'Your profile is up to date.', undo: 'Undo', show: 'Show toast' },
  tr: { tone: 'Stil', device: 'Cihaz', description: 'Açıklama', actions: 'CTA butonları', figma: 'Figma varyantı', code: 'Kod', title: 'Değişiklikler kaydedildi', text: 'Profiliniz güncel.', undo: 'Geri al', show: 'Toast göster' },
};

function ShowButton({ options, label }: { options: Parameters<ReturnType<typeof useToast>['toast']>[0]; label: string }) {
  const { toast } = useToast();
  return (
    <Button size="small" tone="secondary" onClick={() => toast(options)}>
      {label}
    </Button>
  );
}

export function ToastPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [tone, setTone] = useState<ToastTone>('success');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [description, setDescription] = useState(true);
  const [actions, setActions] = useState(false);

  const options = {
    tone,
    device,
    title: c.title,
    description: description ? c.text : undefined,
    actions: actions ? (
      <Button size="small" tone="tertiary">
        {c.undo}
      </Button>
    ) : undefined,
  };
  const props = [tone !== 'default' && `tone: '${tone}'`, device === 'mobile' && "device: 'mobile'", `title: '${c.title}'`, description && `description: '${c.text}'`, actions && 'actions: <Button size="small">…</Button>'].filter(Boolean);
  const code = `import { ToastProvider, useToast } from '@ladom/ui';\n\n// Once, around the app:\n<ToastProvider>{children}</ToastProvider>\n\n// Anywhere inside:\nconst { toast } = useToast();\ntoast({ ${props.join(', ')} });`;
  const figma = `Style=${FIGMA_STYLE[tone]}\nDevice=${device === 'mobile' ? 'Mobile' : 'Desktop'}\nDescription=${description ? 'True' : 'False'}\nCTA Buttons=${actions ? 'True' : 'False'}\nClose Button=True`;

  return (
    <ToastProvider closeLabel={lang === 'tr' ? 'Kapat' : 'Close'}>
      <div className={styles.playground}>
        <div className={styles.stage} style={{ flexDirection: 'column', gap: 'var(--space-large)' }}>
          <Toast {...options} onClose={() => {}} closeLabel={lang === 'tr' ? 'Kapat' : 'Close'} />
          <ShowButton options={options} label={c.show} />
        </div>
        <div className={styles.controls}>
          <label>
            {c.tone}
            <select value={tone} onChange={(e) => setTone(e.target.value as ToastTone)}>
              {TONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            {c.device}
            <select value={device} onChange={(e) => setDevice(e.target.value as 'desktop' | 'mobile')}>
              <option>desktop</option>
              <option>mobile</option>
            </select>
          </label>
          {(
            [
              [c.description, description, setDescription],
              [c.actions, actions, setActions],
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
    </ToastProvider>
  );
}
