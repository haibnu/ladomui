'use client';

import { useState } from 'react';
import { FormField, Textarea } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { count: 'Count', max: 'Max length', hint: 'Hint', error: 'Error', disabled: 'Disabled', figma: 'Figma variant', code: 'Code', label: 'Note', hintText: 'Shown on the receipt.', errorText: 'Write a shorter note.', placeholder: 'Add a note for the order' },
  tr: { count: 'Sayaç', max: 'En fazla', hint: 'İpucu', error: 'Hata', disabled: 'Devre dışı', figma: 'Figma varyantı', code: 'Kod', label: 'Not', hintText: 'Fişte görünür.', errorText: 'Daha kısa bir not yazın.', placeholder: 'Sipariş için bir not ekleyin' },
};

export function TextareaPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [count, setCount] = useState(true);
  const [max, setMax] = useState(200);
  const [hint, setHint] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const code = `import { FormField, Textarea } from '@/components/ladom';

<FormField label="${c.label}"${error ? ` error="${c.errorText}"` : hint ? ` hint="${c.hintText}"` : ''}>
  <Textarea${count ? '\n    showCount' : ''}${max ? `\n    maxLength={${max}}` : ''}${disabled ? '\n    disabled' : ''}
    placeholder="${c.placeholder}"
  />
</FormField>`;
  const figma = count
    ? `Textarea / Count\nHint=${hint || error ? 'True' : 'False'}\nCount=0/${max}`
    : `Textarea\n🎛 Type=Normal\nHint=${hint || error ? 'True' : 'False'}\nError=${error ? 'True' : 'False'}\nDisabled=${disabled ? 'True' : 'False'}`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: '100%', maxInlineSize: 360 }}>
          <FormField label={c.label} hint={hint ? c.hintText : undefined} error={error ? c.errorText : undefined}>
            <Textarea showCount={count} maxLength={max || undefined} disabled={disabled} placeholder={c.placeholder} />
          </FormField>
        </div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.max}
          <input type="number" min={0} value={max} onChange={(e) => setMax(Number(e.target.value) || 0)} />
        </label>
        {(
          [
            [c.count, count, setCount],
            [c.hint, hint, setHint],
            [c.error, error, setError],
            [c.disabled, disabled, setDisabled],
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
