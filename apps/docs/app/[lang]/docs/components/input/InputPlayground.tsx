'use client';

import { useState } from 'react';
import { FormField, Input, type InputSize } from '@ladom/ui';
import { IconEmoji, IconProfile } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
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
        <ControlSelect label={c.type} value={kind} options={['text', 'search', 'password'] as const} onChange={setKind} />
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <ControlSelect label={c.state} value={state} options={['default', 'hover', 'focus', 'typed'] as const} onChange={setState} />
        <ControlText label={c.placeholder} value={placeholder} onChange={setPlaceholder} />
        <ControlText label={c.prefix} value={prefix} onChange={setPrefix} placeholder="https://" />
        <ControlText label={c.suffix} value={suffix} onChange={setSuffix} placeholder="@gmail.com" />
        <ControlCheck label={c.iconL} checked={iconL} onChange={setIconL} />
        <ControlCheck label={c.iconR} checked={iconR} onChange={setIconR} />
        <ControlCheck label={c.error} checked={error} onChange={setError} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <ControlCheck label={c.field} checked={inField} onChange={setInField} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
