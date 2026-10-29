'use client';

import { useState } from 'react';
import { Avatar, Badge, Cell, type CellSize } from '@ladom/ui';
import { IconAdd, IconArrowRight } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Type = 'default' | 'checkbox' | 'radio' | 'destructive';
const FIGMA_TYPE: Record<Type, string> = { default: 'Default', checkbox: 'Checkbox', radio: 'Radio', destructive: 'Destructive' };
const COPY = {
  en: {
    type: 'Type', size: 'Size', text: 'Text', selected: 'Selected', hover: 'Hover', iconLeft: 'Icon (L)', iconRight: 'Icon (R)', avatar: 'Avatar', badgeLeft: 'Badge (L)', badgeRight: 'Badge (R)', bodycopy: 'Bodycopy', inlineBadge: 'Inline badge', subtitle: 'Subtitle',
    figma: 'Figma variant', code: 'Code', sample: 'Istanbul', bodySample: 'Türkiye', subSample: '15.6 million people',
  },
  tr: {
    type: 'Tip', size: 'Boyut', text: 'Metin', selected: 'Seçili', hover: 'Hover', iconLeft: 'İkon (L)', iconRight: 'İkon (R)', avatar: 'Avatar', badgeLeft: 'Badge (L)', badgeRight: 'Badge (R)', bodycopy: 'Bodycopy', inlineBadge: 'Satır içi badge', subtitle: 'Alt başlık',
    figma: 'Figma varyantı', code: 'Kod', sample: 'İstanbul', bodySample: 'Türkiye', subSample: '15,6 milyon kişi',
  },
};

export function CellPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [type, setType] = useState<Type>('default');
  const [size, setSize] = useState<CellSize>('medium');
  const [text, setText] = useState(c.sample);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const on = (k: string) => Boolean(flags[k]);
  const badgeSize = size === 'medium' ? 'tiny' : 'micro';
  const multi = on('bodycopy') || on('inlineBadge') || on('subtitle');

  const cell = (
    <Cell
      size={size}
      selected={on('selected')}
      tone={type === 'destructive' ? 'destructive' : 'default'}
      control={type === 'checkbox' || type === 'radio' ? type : undefined}
      data-state={on('hover') ? 'hover' : undefined}
      iconLeft={on('iconLeft') ? <IconAdd /> : undefined}
      iconRight={on('iconRight') ? <IconArrowRight /> : undefined}
      avatar={on('avatar') ? <Avatar size={size === 'medium' ? 'tiny' : 'micro'} name="Halil Nuroğlu" /> : undefined}
      badgeLeft={on('badgeLeft') ? <Badge size={badgeSize} tone="primary">New</Badge> : undefined}
      badgeRight={on('badgeRight') ? <Badge size={badgeSize} tone="primary">New</Badge> : undefined}
      bodycopy={on('bodycopy') ? c.bodySample : undefined}
      inlineBadge={on('inlineBadge') ? <Badge size={badgeSize} tone="primary">New</Badge> : undefined}
      subtitle={on('subtitle') ? c.subSample : undefined}
    >
      {text}
    </Cell>
  );

  const props = [
    size !== 'medium' && `size="${size}"`,
    on('selected') && 'selected',
    type === 'destructive' && 'tone="destructive"',
    (type === 'checkbox' || type === 'radio') && `control="${type}"`,
    on('iconLeft') && 'iconLeft={<IconAdd />}',
    on('iconRight') && 'iconRight={<IconArrowRight />}',
    on('avatar') && `avatar={<Avatar size="${size === 'medium' ? 'tiny' : 'micro'}" name="Halil Nuroğlu" />}`,
    on('badgeLeft') && `badgeLeft={<Badge size="${badgeSize}" tone="primary">New</Badge>}`,
    on('badgeRight') && `badgeRight={<Badge size="${badgeSize}" tone="primary">New</Badge>}`,
    on('bodycopy') && `bodycopy="${c.bodySample}"`,
    on('inlineBadge') && `inlineBadge={<Badge size="${badgeSize}" tone="primary">New</Badge>}`,
    on('subtitle') && `subtitle="${c.subSample}"`,
  ].filter(Boolean);
  const code = `import { Cell } from '@ladom/ui';\n\n<Cell${props.map((p) => `\n  ${p}`).join('')}${props.length ? '\n' : ''}>\n  ${text}\n</Cell>`;
  const figma = [
    `🎛 Type=${multi && type === 'default' ? 'Multi Text' : FIGMA_TYPE[type]}`,
    `👕 Size=${size === 'medium' ? 'Medium' : 'Small'}`,
    `🕹 State=${on('hover') ? 'Hover' : 'Default'}`,
    `Selected=${on('selected') ? 'True' : 'False'}`,
    ...(['iconLeft', 'iconRight', 'avatar', 'badgeLeft', 'badgeRight', 'bodycopy', 'inlineBadge', 'subtitle'] as const).map(
      (k) => `${{ iconLeft: 'Icon (L)', iconRight: 'Icon (R)', avatar: 'Avatar', badgeLeft: 'Badge (L)', badgeRight: 'Badge (R)', bodycopy: 'Bodycopy', inlineBadge: 'Inline Badge', subtitle: 'Subtitle' }[k]}=${on(k) ? 'True' : 'False'}`,
    ),
  ].join('\n');
  const toggles = ['selected', 'hover', 'iconLeft', 'iconRight', 'avatar', 'badgeLeft', 'badgeRight', 'bodycopy', 'inlineBadge', 'subtitle'] as const;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: 320 }}>{cell}</div>
      </div>
      <div className={styles.controls}>
        <label>
          {c.type}
          <select value={type} onChange={(e) => setType(e.target.value as Type)}>
            {Object.keys(FIGMA_TYPE).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          {c.size}
          <select value={size} onChange={(e) => setSize(e.target.value as CellSize)}>
            <option>medium</option>
            <option>small</option>
          </select>
        </label>
        <label>
          {c.text}
          <input value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        {toggles.map((k) => (
          <label key={k} className={styles.check}>
            <input type="checkbox" checked={on(k)} onChange={(e) => setFlags({ ...flags, [k]: e.target.checked })} /> {c[k]}
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
