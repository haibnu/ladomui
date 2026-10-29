'use client';

import { useState } from 'react';
import { Label } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Kind = 'default' | 'icon' | 'subtitle' | 'hint';
const FIGMA_TYPE: Record<Kind, string> = { default: 'Default', icon: 'Icon', subtitle: 'Subtitle', hint: 'Hint' };
const COPY = {
  en: { type: 'Type', text: 'Label', extra: 'Subtitle / hint text', optional: 'Optional text', withForm: 'With form element', figma: 'Figma variant', code: 'Code', label: 'Email', sub: 'We never share it', opt: 'Optional' },
  tr: { type: 'Tip', text: 'Label', extra: 'Alt yazı / hint metni', optional: 'Opsiyonel metni', withForm: 'Form öğesiyle', figma: 'Figma varyantı', code: 'Kod', label: 'E-posta', sub: 'Kimseyle paylaşmayız', opt: 'Opsiyonel' },
};

export function LabelPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [kind, setKind] = useState<Kind>('default');
  const [text, setText] = useState(c.label);
  const [extra, setExtra] = useState(c.sub);
  const [optional, setOptional] = useState('');
  const [withForm, setWithForm] = useState(false);

  const props = [
    kind === 'icon' && 'info',
    kind === 'subtitle' && `subtitle="${extra}"`,
    kind === 'hint' && `hint="${extra}"`,
    optional && `optional="${optional}"`,
    withForm && 'withFormElement',
    'htmlFor="email"',
  ].filter(Boolean);
  const code = `import { Label } from '@ladom/ui';\n\n<Label${props.map((p) => ` ${p}`).join('')}>${text}</Label>`;
  const figma = `🎛 Type=${FIGMA_TYPE[kind]}\nwith Form Element=${withForm ? 'True' : 'False'}\nOptional=${optional ? 'True' : 'False'}${optional ? `\n⌙ Optional Text=${optional}` : ''}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: 'var(--grid-column-2)' }}>
          <Label
            htmlFor="playground-field"
            info={kind === 'icon'}
            subtitle={kind === 'subtitle' ? extra : undefined}
            hint={kind === 'hint' ? extra : undefined}
            optional={optional || undefined}
            withFormElement={withForm}
          >
            {text}
          </Label>
        </div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.type}
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {Object.keys(FIGMA_TYPE).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label>
          {c.text}
          <input value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        {(kind === 'subtitle' || kind === 'hint') && (
          <label>
            {c.extra}
            <input value={extra} onChange={(e) => setExtra(e.target.value)} />
          </label>
        )}
        <label>
          {c.optional}
          <input value={optional} placeholder={c.opt} onChange={(e) => setOptional(e.target.value)} />
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
