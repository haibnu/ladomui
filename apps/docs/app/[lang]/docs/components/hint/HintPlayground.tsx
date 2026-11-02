'use client';

import { useState } from 'react';
import { Hint, type HintSize, type HintTone } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
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
        <ControlSelect label={c.tone} value={tone} options={TONES} onChange={setTone} />
        <ControlSelect label={c.size} value={size} options={['small', 'medium'] as const} onChange={setSize} />
        <ControlText label={c.text} value={text} onChange={setText} />
        <ControlCheck label={c.withForm} checked={withForm} onChange={setWithForm} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
