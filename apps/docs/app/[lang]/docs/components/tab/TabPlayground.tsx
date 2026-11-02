'use client';

import { useState } from 'react';
import { Tabs, type TabsItem } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Variant = 'primary' | 'secondary' | 'button';
type Align = 'start' | 'center' | 'end';
const COPY = {
  en: { variant: 'Type', align: 'Align', count: 'Tabs', border: 'Border bottom', badge: 'Badge', info: 'Info', disabled: 'Disable last', figma: 'Figma variant', code: 'Code', labels: ['Overview', 'Activity', 'Members', 'Settings', 'Billing', 'Usage', 'Logs'], panel: 'Content of' },
  tr: { variant: 'Tip', align: 'Hizalama', count: 'Sekme', border: 'Alt çizgi', badge: 'Badge', info: 'Info', disabled: 'Sonuncuyu pasif yap', figma: 'Figma varyantı', code: 'Kod', labels: ['Genel bakış', 'Etkinlik', 'Üyeler', 'Ayarlar', 'Fatura', 'Kullanım', 'Kayıtlar'], panel: 'İçerik:' },
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function TabPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [variant, setVariant] = useState<Variant>('primary');
  const [align, setAlign] = useState<Align>('start');
  const [count, setCount] = useState(4);
  const [border, setBorder] = useState(true);
  const [badge, setBadge] = useState(false);
  const [info, setInfo] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('t0');

  const items: TabsItem[] = c.labels.slice(0, count).map((label, i) => ({
    value: `t${i}`,
    label,
    badge: badge && i === 1 ? 3 : undefined,
    info: info && i === 0,
    disabled: disabled && i === count - 1,
    content: <p style={{ margin: 0 }}>{`${c.panel} ${label}`}</p>,
  }));
  const props = [`aria-label="Sections"`, variant !== 'primary' && `variant="${variant}"`, align !== 'start' && `align="${align}"`, border && 'border', 'value={tab}', 'onChange={setTab}'].filter(Boolean);
  const code = `import { Tabs } from '@ladom/ui';\n\n<Tabs\n  items={[\n${items.map((i) => `    { value: '${i.value}', label: '${i.label}'${i.badge ? ', badge: 3' : ''}${i.info ? ', info: true' : ''}${i.disabled ? ', disabled: true' : ''}, content: <…/> },`).join('\n')}\n  ]}${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const figma = `Tab\nAlign=${align === 'start' ? 'Left' : align === 'end' ? 'Right' : 'Center'}\nBorder Bottom=${border ? 'True' : 'False'}\n\nTab Item\nType=${cap(variant)}\nBadge=${badge ? 'True' : 'False'}\nInfo=${info ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Tabs aria-label="Sections" items={items} variant={variant} align={align} border={border} value={value} onChange={setValue} style={{ inlineSize: '100%' }} />
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.variant} value={variant} options={['primary', 'secondary', 'button'] as const} onChange={setVariant} />
        <ControlSelect label={c.align} value={align} options={['start', 'center', 'end'] as const} onChange={setAlign} />
        <ControlSelect label={c.count} value={String(count)} options={[2, 3, 4, 5, 6, 7].map(String)} onChange={(v) => setCount(Number(v))} />
        <ControlCheck label={c.border} checked={border} onChange={setBorder} />
        <ControlCheck label={c.badge} checked={badge} onChange={setBadge} />
        <ControlCheck label={c.info} checked={info} onChange={setInfo} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
