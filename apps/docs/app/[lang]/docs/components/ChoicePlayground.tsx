'use client';

import { useState, type ChangeEvent } from 'react';
import { Checkbox, ChoiceGroup, Radio, Switch } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

// One playground for Checkbox, Radio and Switch; the controls follow each component's Figma properties.
type Kind = 'checkbox' | 'radio' | 'switch';
type State = 'default' | 'hover' | 'focus';
const COPY = {
  en: { size: 'Size', state: 'State', label: 'Label', checked: 'Checked', indeterminate: 'Indeterminate', error: 'Error', disabled: 'Disabled', labelStart: 'Label before', group: 'In a group', figma: 'Figma variant', code: 'Code', sample: 'Remember me', groupLabel: 'Notifications', options: ['Email', 'SMS', 'Push'] },
  tr: { size: 'Boyut', state: 'Durum', label: 'Label', checked: 'İşaretli', indeterminate: 'Belirsiz', error: 'Hata', disabled: 'Pasif', labelStart: 'Label önde', group: 'Grup içinde', figma: 'Figma varyantı', code: 'Kod', sample: 'Beni hatırla', groupLabel: 'Bildirimler', options: ['E-posta', 'SMS', 'Push'] },
};
const NAME = { checkbox: 'Checkbox', radio: 'Radio', switch: 'Switch' } as const;

export function ChoicePlayground({ kind }: { kind: Kind }) {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const sizes = kind === 'switch' ? ['medium', 'large'] : ['medium', 'small'];
  const [size, setSize] = useState(sizes[0]!);
  const [state, setState] = useState<State>('default');
  const [label, setLabel] = useState(c.sample);
  const [checked, setChecked] = useState(kind !== 'checkbox');
  const [indeterminate, setIndeterminate] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [labelStart, setLabelStart] = useState(false);
  const [inGroup, setInGroup] = useState(false);

  const forced = state === 'default' ? undefined : state;
  const single = (name: string, value: string, isChecked: boolean, onToggle: (v: boolean) => void) => {
    const common = { label: name, disabled, 'data-state': forced, onChange: (e: ChangeEvent<HTMLInputElement>) => onToggle(e.target.checked) };
    if (kind === 'checkbox') return <Checkbox key={value} {...common} size={size as 'medium'} checked={isChecked} indeterminate={indeterminate} error={inGroup ? undefined : error} />;
    if (kind === 'radio') return <Radio key={value} {...common} name="playground" value={value} size={size as 'medium'} checked={isChecked} error={inGroup ? undefined : error} />;
    return <Switch key={value} {...common} size={size as 'medium'} checked={isChecked} error={inGroup ? undefined : error} labelPosition={labelStart ? 'start' : 'end'} />;
  };

  const [picked, setPicked] = useState(0);
  const preview = inGroup ? (
    <ChoiceGroup label={c.groupLabel} error={error ? (lang === 'tr' ? 'Bir seçenek seçin' : 'Pick an option') : undefined}>
      {c.options.map((o, i) =>
        single(o, `o${i}`, kind === 'radio' ? picked === i : i === 0 ? checked : false, (v) => (kind === 'radio' ? v && setPicked(i) : i === 0 && setChecked(v))),
      )}
    </ChoiceGroup>
  ) : (
    single(label, 'single', checked, setChecked)
  );

  const props = [
    `label="${label}"`,
    size !== sizes[0] && `size="${size}"`,
    kind === 'switch' && labelStart && 'labelPosition="start"',
    checked && 'defaultChecked',
    kind === 'checkbox' && indeterminate && 'indeterminate',
    error && 'error',
    disabled && 'disabled',
    kind === 'radio' && 'name="plan" value="pro"',
  ].filter(Boolean);
  const code = `import { ${NAME[kind]} } from '@ladom/ui';\n\n<${NAME[kind]}${props.map((p) => ` ${p}`).join('')} />`;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const figma =
    kind === 'checkbox'
      ? `🕹 State=${cap(state)}\nSize=${cap(size)}\nChecked=${checked ? 'True' : 'False'}\nwith Label=${label ? 'True' : 'False'}\nError=${error ? 'True' : 'False'}\nDisabled=${disabled ? 'True' : 'False'}\nIndeterminate=${indeterminate ? 'True' : 'False'}`
      : kind === 'radio'
        ? `🕹 State=${cap(state === 'focus' ? 'default' : state)}\n👕 Size=${cap(size)}\nChecked=${checked ? 'True' : 'False'}\nwith Text=${label ? 'True' : 'False'}\nError=${error ? 'True' : 'False'}\nDisabled=${disabled ? 'True' : 'False'}`
        : `👕 Size=${cap(size)}\n🕹 State=${cap(state === 'focus' ? 'default' : state)}\nActive=${checked ? 'True' : 'False'}\nDisabled=${disabled ? 'True' : 'False'}\nError=${error ? 'True' : 'False'}\nLabel (L)=${labelStart ? 'True' : 'False'}\nLabel (R)=${labelStart ? 'False' : 'True'}`;

  const toggles: [string, boolean, (v: boolean) => void][] = [
    [c.checked, checked, setChecked],
    ...(kind === 'checkbox' ? ([[c.indeterminate, indeterminate, setIndeterminate]] as [string, boolean, (v: boolean) => void][]) : []),
    [c.error, error, setError],
    [c.disabled, disabled, setDisabled],
    ...(kind === 'switch' ? ([[c.labelStart, labelStart, setLabelStart]] as [string, boolean, (v: boolean) => void][]) : []),
    [c.group, inGroup, setInGroup],
  ];

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>{preview}</div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.size} value={size} options={sizes} onChange={setSize} />
        <ControlSelect label={c.state} value={state} options={['default', 'hover', 'focus'] as const} onChange={setState} />
        <ControlText label={c.label} value={label} onChange={setLabel} />
        {toggles.map(([text, value, set]) => (
          <ControlCheck key={text} label={text} checked={value} onChange={set} />
        ))}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
