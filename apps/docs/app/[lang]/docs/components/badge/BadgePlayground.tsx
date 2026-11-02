'use client';

import { useState } from 'react';
import { Badge, type BadgeSize, type BadgeTone } from '@ladom/ui';
import { IconCheck } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const TONES: BadgeTone[] = ['default', 'primary', 'secondary', 'tertiary', 'error', 'success', 'warning'];
const SIZES: BadgeSize[] = ['medium', 'small', 'tiny', 'micro'];
const COPY = {
  en: { tone: 'Tone', size: 'Size', text: 'Text', filled: 'Filled', disabled: 'Disabled', iconLeft: 'Leading icon', iconRight: 'Trailing icon', figma: 'Figma variant', code: 'Code', sample: 'Badge' },
  tr: { tone: 'Ton', size: 'Boyut', text: 'Metin', filled: 'Dolu', disabled: 'Pasif', iconLeft: 'Baştaki ikon', iconRight: 'Sondaki ikon', figma: 'Figma varyantı', code: 'Kod', sample: 'Badge' },
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function BadgePlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [tone, setTone] = useState<BadgeTone>('primary');
  const [size, setSize] = useState<BadgeSize>('medium');
  const [text, setText] = useState(c.sample);
  const [filled, setFilled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [iconLeft, setIconLeft] = useState(false);
  const [iconRight, setIconRight] = useState(false);

  const props = [
    tone !== 'default' && `tone="${tone}"`,
    size !== 'medium' && `size="${size}"`,
    filled && 'filled',
    disabled && 'disabled',
    iconLeft && 'iconLeft={<IconCheck />}',
    iconRight && 'iconRight={<IconCheck />}',
  ].filter(Boolean);
  const code = `import { Badge } from '@ladom/ui';\n\n<Badge${props.map((p) => ` ${p}`).join('')}>${text}</Badge>`;
  const figma = `💅 Style=${cap(tone)}\n👕 Size=${cap(size)}\nDisabled=${disabled ? 'True' : 'False'}\nFilled=${filled ? 'True' : 'False'}\nIcon Leading=${iconLeft ? 'True' : 'False'}\nIcon Trailing=${iconRight ? 'True' : 'False'}`;
  const toggles: [string, boolean, (v: boolean) => void][] = [
    [c.filled, filled, setFilled],
    [c.disabled, disabled, setDisabled],
    [c.iconLeft, iconLeft, setIconLeft],
    [c.iconRight, iconRight, setIconRight],
  ];

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Badge tone={tone} size={size} filled={filled} disabled={disabled} iconLeft={iconLeft ? <IconCheck /> : undefined} iconRight={iconRight ? <IconCheck /> : undefined}>
          {text}
        </Badge>
      </div>
      <div className={styles.controls}>
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
