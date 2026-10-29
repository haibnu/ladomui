'use client';

import { useState } from 'react';
import { FormField, Selectbox, type SelectboxSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Type = 'basic' | 'inner' | 'multiselect' | 'chip';
type State = 'default' | 'hover' | 'focus' | 'active';
const SIZES: SelectboxSize[] = ['large', 'medium', 'small', 'tiny'];
const FIGMA_TYPE: Record<Type, string> = { basic: 'Basic', inner: 'Inner Label', multiselect: 'Multiselect', chip: 'Chip' };
const COPY = {
  en: {
    type: 'Type', size: 'Size', state: 'State', error: 'Error', disabled: 'Disabled', fluid: 'Fluid', searchable: 'Searchable', withField: 'With label and hint',
    figma: 'Figma variant', code: 'Code', label: 'City', hint: 'Where you live', placeholder: 'Select a city', search: 'Search',
    cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Eskişehir', 'Trabzon'],
  },
  tr: {
    type: 'Tip', size: 'Boyut', state: 'Durum', error: 'Hata', disabled: 'Pasif', fluid: 'Tam genişlik', searchable: 'Aranabilir', withField: 'Label ve hint ile',
    figma: 'Figma varyantı', code: 'Kod', label: 'Şehir', hint: 'Yaşadığınız şehir', placeholder: 'Şehir seçin', search: 'Ara',
    cities: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Trabzon'],
  },
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function SelectboxPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [type, setType] = useState<Type>('basic');
  const [size, setSize] = useState<SelectboxSize>('medium');
  const [state, setState] = useState<State>('default');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fluid, setFluid] = useState(true);
  const [searchable, setSearchable] = useState(false);
  const [withField, setWithField] = useState(false);
  const [one, setOne] = useState<string>('');
  const [many, setMany] = useState<string[]>([]);

  const options = c.cities.map((label) => ({ value: label.toLocaleLowerCase('en'), label }));
  const multiple = type === 'multiselect' || type === 'chip';
  const common = {
    options,
    size,
    fluid,
    error,
    disabled,
    searchable,
    searchPlaceholder: c.search,
    placeholder: c.placeholder,
    innerLabel: type === 'inner' ? c.label : undefined,
    'data-state': state === 'default' ? undefined : state,
    'aria-label': withField || type === 'inner' ? undefined : c.label,
  } as const;
  const box = multiple ? (
    <Selectbox {...common} multiple display={type === 'chip' ? 'chips' : 'count'} value={many} onChange={setMany} />
  ) : (
    <Selectbox {...common} value={one} onChange={setOne} />
  );

  const props = [
    `options={cities}`,
    size !== 'medium' && `size="${size}"`,
    type === 'inner' && `innerLabel="${c.label}"`,
    multiple && 'multiple',
    type === 'chip' && 'display="chips"',
    !fluid && 'fluid={false}',
    searchable && 'searchable',
    error && 'error',
    disabled && 'disabled',
    'value={value}',
    'onChange={setValue}',
  ].filter(Boolean);
  const tag = `<Selectbox${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const code = withField
    ? `import { FormField, Selectbox } from '@ladom/ui';\n\n<FormField label="${c.label}" hint="${c.hint}">\n  ${tag.replace(/\n/g, '\n  ')}\n</FormField>`
    : `import { Selectbox } from '@ladom/ui';\n\n${tag}`;
  const figma = withField
    ? `Form Selectbox\nShow Label=True\nShow Hint=True\nDropdown=False\n\n🎛 Type=${FIGMA_TYPE[type]}\n👕 Size=${cap(size)}\n🕹 State=${cap(state)}`
    : `🎛 Type=${FIGMA_TYPE[type]}\n👕 Size=${cap(size)}\n🕹 State=${cap(state)}\nDisable=${disabled ? 'True' : 'False'}\nError=${error ? 'True' : 'False'}\nFluid=${fluid ? 'True' : 'False'}`;
  const toggles: [string, boolean, (v: boolean) => void][] = [
    [c.error, error, setError],
    [c.disabled, disabled, setDisabled],
    [c.fluid, fluid, setFluid],
    [c.searchable, searchable, setSearchable],
    [c.withField, withField, setWithField],
  ];

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ alignItems: 'flex-start', minBlockSize: 360 }}>
        <div style={{ inlineSize: 280 }}>
          {withField ? (
            <FormField label={c.label} hint={c.hint} error={error ? (lang === 'tr' ? 'Bir şehir seçin' : 'Choose a city') : undefined}>
              {box}
            </FormField>
          ) : (
            box
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.type}
          <select value={type} onChange={(e) => setType(e.target.value as Type)}>
            <option value="basic">basic</option>
            <option value="inner">inner label</option>
            <option value="multiselect">multiselect</option>
            <option value="chip">chip</option>
          </select>
        </label>
        <label>
          {c.size}
          <select value={size} onChange={(e) => setSize(e.target.value as SelectboxSize)}>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          {c.state}
          <select value={state} onChange={(e) => setState(e.target.value as State)}>
            <option>default</option>
            <option>hover</option>
            <option>focus</option>
            <option>active</option>
          </select>
        </label>
        {toggles.map(([label, value, set]) => (
          <label key={label} className={styles.check}>
            <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} /> {label}
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
