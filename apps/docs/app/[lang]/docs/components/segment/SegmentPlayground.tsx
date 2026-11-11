'use client';

import { useState } from 'react';
import { Segment, type SegmentOption, type SegmentSize } from '@ladom/ui';
import { IconDateRange, IconList, IconMap } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type ItemType = 'default' | 'left-icon' | 'right-icon' | 'badge' | 'info';
const FIGMA_ITEM: Record<ItemType, string> = { default: 'Default', 'left-icon': 'Left Icon', 'right-icon': 'Right Icon', badge: 'Badge', info: 'Info' };
const COPY = {
  en: { size: 'Size', count: 'Count', item: 'Item type', fluid: 'Fluid', disabled: 'Disabled', spacing: 'Form spacing', figma: 'Figma variant', code: 'Code', labels: ['List', 'Map', 'Calendar'] },
  tr: { size: 'Boyut', count: 'Adet', item: 'Öğe tipi', fluid: 'Tam genişlik', disabled: 'Pasif', spacing: 'Form boşluğu', figma: 'Figma varyantı', code: 'Kod', labels: ['Liste', 'Harita', 'Takvim'] },
};

export function SegmentPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [size, setSize] = useState<SegmentSize>('medium');
  const [count, setCount] = useState(3);
  const [item, setItem] = useState<ItemType>('default');
  const [fluid, setFluid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [spacing, setSpacing] = useState(false);
  const [value, setValue] = useState('list');

  const values = ['list', 'map', 'calendar'].slice(0, count);
  const icons = [<IconList key="l" />, <IconMap key="m" />, <IconDateRange key="c" />];
  const options: SegmentOption[] = values.map((v, i) => ({
    value: v,
    label: c.labels[i],
    ...(item === 'left-icon' || item === 'right-icon' ? { icon: icons[i], iconPosition: item === 'right-icon' ? ('end' as const) : ('start' as const) } : {}),
    ...(item === 'badge' ? { badge: i + 1 } : {}),
    ...(item === 'info' ? { info: true } : {}),
  }));
  const extra = item === 'left-icon' ? ', icon: <IconList />' : item === 'right-icon' ? ", icon: <IconList />, iconPosition: 'end'" : item === 'badge' ? ', badge: 2' : item === 'info' ? ', info: true' : '';
  const props = [size !== 'medium' && `size="${size}"`, fluid && 'fluid', disabled && 'disabled', spacing && 'spacing', 'value={value}', 'onChange={setValue}'].filter(Boolean);
  const code = `import { Segment } from '@ladom/ui';\n\n<Segment\n  aria-label="View"\n  options={[\n${values.map((v, i) => `    { value: '${v}', label: '${c.labels[i]}'${extra} },`).join('\n')}\n  ]}${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const figma = `Segment\n👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\nCount=${count}\nFluid=${fluid ? 'True' : 'False'}\nForm Spacing=${spacing ? 'True' : 'False'}\nDisable=${disabled ? 'True' : 'False'}\n\n.Segment Item\nType=${FIGMA_ITEM[item]}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={fluid ? { inlineSize: '100%', maxInlineSize: 360 } : undefined}>
          <Segment aria-label="View" options={options} size={size} fluid={fluid} disabled={disabled} spacing={spacing} value={value} onChange={setValue} />
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <ControlSelect label={c.count} value={String(count)} options={['2', '3']} onChange={(v) => setCount(Number(v))} />
        <ControlSelect label={c.item} value={item} options={Object.keys(FIGMA_ITEM) as ItemType[]} onChange={setItem} />
        <ControlCheck label={c.fluid} checked={fluid} onChange={setFluid} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <ControlCheck label={c.spacing} checked={spacing} onChange={setSpacing} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
