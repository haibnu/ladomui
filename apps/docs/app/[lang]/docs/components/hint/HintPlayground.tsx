'use client';

import { useState } from 'react';
import { Hint, type HintSize, type HintTone } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const TONES: HintTone[] = ['default', 'info', 'error', 'success', 'warning'];
const FIGMA_TYPE: Record<HintTone, string> = { default: 'Default', info: 'Information', error: 'Error', success: 'Success', warning: 'Warning' };
const COPY = {
  en: { tone: 'Tone', size: 'Size', text: 'Text', withForm: 'With form', figma: 'Figma variant', code: 'Code', sample: 'Use at least 8 characters' },
  tr: { tone: 'Ton', size: 'Boyut', text: 'Metin', withForm: 'Form altında', figma: 'Figma varyantı', code: 'Kod', sample: 'En az 8 karakter kullanın' },
};

export function HintPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [tone, setTone] = useState<HintTone>('default');
  const [size, setSize] = useState<HintSize>('small');
  const [withForm, setWithForm] = useState(false);
  const [text, setText] = useState(c.sample);

  const props = [tone !== 'default' && `tone="${tone}"`, size !== 'small' && `size="${size}"`, withForm && 'withForm'].filter(Boolean);
  const code = `import { Hint } from '@ladom/ui';\n\n<Hint${props.map((p) => ` ${p}`).join('')}>${text}</Hint>`;
  const figma = `👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\n🎛 Type=${FIGMA_TYPE[tone]}\nwith Form=${withForm ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Hint tone={tone} size={size} withForm={withForm}>
          {text}
        </Hint>
      </div>
      <div className={styles.controls}>
        <label>
          {c.tone}
          <select value={tone} onChange={(e) => setTone(e.target.value as HintTone)}>
            {TONES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          {c.size}
          <select value={size} onChange={(e) => setSize(e.target.value as HintSize)}>
            <option>small</option>
            <option>medium</option>
          </select>
        </label>
        <label>
          {c.text}
          <input value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={withForm} onChange={(e) => setWithForm(e.target.checked)} /> {c.withForm}
        </label>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
