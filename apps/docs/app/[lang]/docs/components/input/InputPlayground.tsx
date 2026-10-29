'use client';

import { useState } from 'react';
import { FormField, Input, type InputSize } from '@ladom/ui';
import { IconEmoji, IconProfile } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Kind = 'text' | 'search' | 'password';
type State = 'default' | 'hover' | 'focus' | 'typed';
const COPY = {
  en: { type: 'Type', size: 'Size', state: 'State', placeholder: 'Placeholder', iconL: 'Left icon', iconR: 'Right icon', prefix: 'Prefix', suffix: 'Suffix', error: 'Error', disabled: 'Disabled', field: 'In FormField', label: 'Label', hint: 'Hint', figma: 'Figma variant', code: 'Code', ph: 'Your name', lb: 'Name', ht: 'As on your ID', err: 'Name is required' },
  tr: { type: 'Tip', size: 'Boyut', state: 'Durum', placeholder: 'Placeholder', iconL: 'Sol ikon', iconR: 'Sağ ikon', prefix: 'Ön ek', suffix: 'Son ek', error: 'Hata', disabled: 'Pasif', field: 'FormField içinde', label: 'Label', hint: 'Hint', figma: 'Figma varyantı', code: 'Kod', ph: 'Adınız', lb: 'Ad', ht: 'Kimliğinizdeki gibi', err: 'Ad zorunlu' },
};
const FIGMA_TYPE: Record<Kind, string> = { text: 'Text', search: 'Search', password: 'Password' };

export function InputPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [kind, setKind] = useState<Kind>('text');
  const [size, setSize] = useState<InputSize>('medium');
  const [state, setState] = useState<State>('default');
  const [placeholder, setPlaceholder] = useState(c.ph);
  const [iconL, setIconL] = useState(false);
  const [iconR, setIconR] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [inField, setInField] = useState(true);

  const input = (
    <Input
      type={kind}
      size={size}
      placeholder={placeholder}
      iconLeft={iconL ? <IconProfile /> : undefined}
      iconRight={iconR ? <IconEmoji /> : undefined}
      prefix={prefix || undefined}
      suffix={suffix || undefined}
      error={inField ? undefined : error}
      disabled={disabled}
      data-state={state === 'default' ? undefined : state}
    />
  );

  const inputProps = [
    kind !== 'text' && `type="${kind}"`,
    size !== 'medium' && `size="${size}"`,
    `placeholder="${placeholder}"`,
    iconL && 'iconLeft={<IconProfile />}',
    iconR && 'iconRight={<IconEmoji />}',
    prefix && `prefix="${prefix}"`,
    suffix && `suffix="${suffix}"`,
    !inField && error && 'error',
    disabled && 'disabled',
  ].filter(Boolean);
  const icons = [iconL && 'IconProfile', iconR && 'IconEmoji'].filter(Boolean);
  const inputJsx = `<Input${inputProps.map((p) => ` ${p}`).join('')} />`;
  const code = [
    `import { ${inField ? 'FormField, Input' : 'Input'} } from '@ladom/ui';`,
    icons.length ? `import { ${icons.join(', ')} } from '@ladom/icons';` : '',
    '',
    inField ? `<FormField label="${c.lb}" ${error ? `error="${c.err}"` : `hint="${c.ht}"`}>\n  ${inputJsx}\n</FormField>` : inputJsx,
  ]
    .filter((l, i) => l || i === 2)
    .join('\n');
  const figma = [
    `🎛 Type=${prefix || suffix ? 'Trailing Text' : FIGMA_TYPE[kind]}`,
    `👕 Size=${size === 'medium' ? 'Medium' : 'Small'}`,
    `🕹 State=${state === 'default' ? 'Default' : state === 'typed' ? 'Typed' : state === 'focus' ? 'Focus' : 'Hover'}`,
    `Icon (L)=${iconL ? 'True' : 'False'}`,
    `Icon (R)=${iconR ? 'True' : 'False'}`,
    `Error=${error ? 'True' : 'False'}`,
    `Disable=${disabled ? 'True' : 'False'}`,
    'Device=Desktop',
    ...(inField ? ['', 'Form Input: Align=Vertical, Show Label=True, Show Hint=True'] : []),
  ].join('\n');

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: 'var(--grid-column-3)' }}>
          {inField ? (
            <FormField label={c.lb} hint={error ? undefined : c.ht} error={error ? c.err : undefined}>
              {input}
            </FormField>
          ) : (
            input
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.type}
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            <option>text</option>
            <option>search</option>
            <option>password</option>
          </select>
        </label>
        <label>
          {c.size}
          <select value={size} onChange={(e) => setSize(e.target.value as InputSize)}>
            <option>medium</option>
            <option>small</option>
          </select>
        </label>
        <label>
          {c.state}
          <select value={state} onChange={(e) => setState(e.target.value as State)}>
            <option>default</option>
            <option>hover</option>
            <option>focus</option>
            <option>typed</option>
          </select>
        </label>
        <label>
          {c.placeholder}
          <input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
        </label>
        <label>
          {c.prefix}
          <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="https://" />
        </label>
        <label>
          {c.suffix}
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="@gmail.com" />
        </label>
        {[
          [c.iconL, iconL, setIconL],
          [c.iconR, iconR, setIconR],
          [c.error, error, setError],
          [c.disabled, disabled, setDisabled],
          [c.field, inField, setInField],
        ].map(([label, value, set]) => (
          <label key={label as string} className={styles.check}>
            <input type="checkbox" checked={value as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} /> {label as string}
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
