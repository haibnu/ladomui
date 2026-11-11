'use client';

import { useState } from 'react';
import { Chip, type ChipSize, type ChipTone } from '@ladom/ui';
import { IconArrowRight, IconCheck } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const TONES: ChipTone[] = ['default', 'primary', 'success', 'error', 'warning'];
const SIZES: ChipSize[] = ['medium', 'small', 'tiny', 'micro'];
const FIGMA_STYLE: Record<ChipTone, string> = { default: 'Default', primary: 'Primary', success: 'Success', error: 'Danger', warning: 'Warning' };
const COPY = {
  en: { tone: 'Tone', size: 'Size', text: 'Text', selected: 'Selected', iconLeft: 'Leading icon', iconRight: 'Trailing icon', key: 'Key', remove: 'Remove', figma: 'Figma variant', code: 'Code', sample: 'Chip text', keySample: 'Key' },
  tr: { tone: 'Ton', size: 'Boyut', text: 'Metin', selected: 'Seçili', iconLeft: 'Baştaki ikon', iconRight: 'Sondaki ikon', key: 'Anahtar', remove: 'Kaldır', figma: 'Figma varyantı', code: 'Kod', sample: 'Chip metni', keySample: 'Anahtar' },
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function ChipPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [tone, setTone] = useState<ChipTone>('default');
  const [size, setSize] = useState<ChipSize>('medium');
  const [text, setText] = useState(c.sample);
  const [selected, setSelected] = useState(false);
  const [iconLeft, setIconLeft] = useState(false);
  const [iconRight, setIconRight] = useState(false);
  const [withKey, setWithKey] = useState(false);
  const [remove, setRemove] = useState(false);
  const [removed, setRemoved] = useState(false);

  // The trailing icon is a check when selected, as in Figma.
  const Right = selected ? IconCheck : IconArrowRight;
  const props = [
    tone !== 'default' && `tone="${tone}"`,
    size !== 'medium' && `size="${size}"`,
    selected && 'selected',
    withKey && `keyLabel="${c.keySample}"`,
    iconLeft && 'iconLeft={<IconArrowRight />}',
    iconRight && `iconRight={<${selected ? 'IconCheck' : 'IconArrowRight'} />}`,
    'onClick={toggle}',
    remove && 'onRemove={remove}',
  ].filter(Boolean);
  const code = `import { Chip } from '@ladom/ui';\n\n<Chip${props.map((p) => ` ${p}`).join('')}>\n  ${text}\n</Chip>`;
  const figma = `💅 Style=${FIGMA_STYLE[tone]}\n👕 Size=${cap(size)}\nSelect=${selected ? 'True' : 'False'}\nShow Icon=${iconLeft ? 'True' : 'False'}\nShow Icon (R)=${iconRight ? 'True' : 'False'}\nKey=${withKey ? 'True' : 'False'}\nRemove=${remove ? 'True' : 'False'}`;
  const toggles: [string, boolean, (v: boolean) => void][] = [
    [c.selected, selected, setSelected],
    [c.key, withKey, setWithKey],
    [c.iconLeft, iconLeft, setIconLeft],
    [c.iconRight, iconRight, setIconRight],
    [c.remove, remove, (v) => (setRemove(v), setRemoved(false))],
  ];

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        {!removed && (
          <Chip
            tone={tone}
            size={size}
            selected={selected}
            keyLabel={withKey ? c.keySample : undefined}
            iconLeft={iconLeft ? <IconArrowRight /> : undefined}
            iconRight={iconRight ? <Right /> : undefined}
            onClick={() => setSelected(!selected)}
            onRemove={remove ? () => setRemoved(true) : undefined}
          >
            {text}
          </Chip>
        )}
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.tone} value={tone} options={TONES} onChange={setTone} />
        <ControlSelect label={c.size} value={size} options={SIZES} onChange={setSize} />
        <ControlText label={c.text} value={text} onChange={setText} />
        {toggles.map(([label, value, set]) => (
          <ControlCheck key={label} label={label} checked={value} onChange={set} />
        ))}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
