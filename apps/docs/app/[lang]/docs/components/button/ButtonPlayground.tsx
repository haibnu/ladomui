'use client';

import { useState, type ComponentType } from 'react';
import { Button, type ButtonSize, type ButtonTone } from '@ladom/ui';
import { IconAdd, IconDownload, IconForward, IconSearch, IconSetting, type IconProps } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import { useLocale } from '@/components/useLocale';
import { buttonCopy } from './content';
import styles from './page.module.css';

const ICONS: Record<string, ComponentType<IconProps>> = {
  add: IconAdd,
  download: IconDownload,
  forward: IconForward,
  search: IconSearch,
  setting: IconSetting,
};
const componentName = (name: string) => `Icon${name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;

const TONES: ButtonTone[] = ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'info'];
const SIZES: ButtonSize[] = ['large', 'medium', 'small', 'tiny'];
const STATES = ['default', 'hover', 'pressed', 'focus'] as const;
type State = (typeof STATES)[number];

// Figma names for the Figma variant readout.
const FIGMA_STYLE: Record<ButtonTone, string> = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', success: 'Success', error: 'Error', warning: 'Warning', info: 'Information',
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function ButtonPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = buttonCopy[lang].playground;

  const [variant, setVariant] = useState<'solid' | 'ghost'>('solid');
  const [tone, setTone] = useState<ButtonTone>('primary');
  const [size, setSize] = useState<ButtonSize>('medium');
  const [state, setState] = useState<State>('default');
  const [label, setLabel] = useState('Button');
  const [subtitle, setSubtitle] = useState('');
  const [iconLeft, setIconLeft] = useState('');
  const [iconRight, setIconRight] = useState('');
  const [iconOnly, setIconOnly] = useState(false);
  const [onlyIcon, setOnlyIcon] = useState('add');
  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const tones = variant === 'ghost' ? TONES.filter((t) => t !== 'info') : TONES;
  const safeTone = variant === 'ghost' && tone === 'info' ? 'primary' : tone;

  const common = {
    size,
    loading,
    disabled,
    'data-state': state === 'default' ? undefined : state,
  };
  const preview =
    variant === 'ghost' ? (
      iconOnly ? (
        <Button variant="ghost" tone={safeTone as Exclude<ButtonTone, 'info'>} icon={ICONS[onlyIcon]!} aria-label={label} {...common} />
      ) : (
        <Button
          variant="ghost"
          tone={safeTone as Exclude<ButtonTone, 'info'>}
          iconLeft={iconLeft ? ICONS[iconLeft] : undefined}
          iconRight={iconRight ? ICONS[iconRight] : undefined}
          subtitle={subtitle || undefined}
          dropdown={dropdown}
          {...common}
        >
          {label}
        </Button>
      )
    ) : iconOnly ? (
      <Button tone={safeTone} icon={ICONS[onlyIcon]!} aria-label={label} {...common} />
    ) : (
      <Button
        tone={safeTone}
        iconLeft={iconLeft ? ICONS[iconLeft] : undefined}
        iconRight={iconRight ? ICONS[iconRight] : undefined}
        subtitle={subtitle || undefined}
        dropdown={dropdown}
        {...common}
      >
        {label}
      </Button>
    );

  // Code for developers
  const props = [
    variant === 'ghost' && 'variant="ghost"',
    safeTone !== 'primary' && `tone="${safeTone}"`,
    size !== 'medium' && `size="${size}"`,
    iconOnly && `icon={${componentName(onlyIcon)}}`,
    iconOnly && `aria-label="${label}"`,
    !iconOnly && iconLeft && `iconLeft={${componentName(iconLeft)}}`,
    !iconOnly && iconRight && `iconRight={${componentName(iconRight)}}`,
    !iconOnly && subtitle && `subtitle="${subtitle}"`,
    !iconOnly && dropdown && 'dropdown',
    loading && 'loading',
    disabled && 'disabled',
  ].filter(Boolean);
  const usedIcons = [...new Set(iconOnly ? [onlyIcon] : [iconLeft, iconRight].filter(Boolean))].map(componentName);
  const jsx = iconOnly ? `<Button${props.map((p) => ` ${p}`).join('')} />` : `<Button${props.map((p) => ` ${p}`).join('')}>${label}</Button>`;
  const code = [
    `import { Button } from '@ladom/ui';`,
    usedIcons.length ? `import { ${usedIcons.join(', ')} } from '@ladom/icons';` : '',
    '',
    jsx,
  ]
    .filter((line, i) => line || i === 2)
    .join('\n');

  // Figma variant for designers
  const figma = [
    `🎛 Type=${variant === 'ghost' ? 'Ghost' : 'Button'}`,
    `💅 Style=${FIGMA_STYLE[safeTone]}`,
    `👕 Size=${cap(size)}`,
    `🕹 State=${state === 'default' ? 'Default' : cap(state)}`,
    `Disable=${disabled ? 'True' : 'False'}`,
    `Icon Button=${iconOnly ? 'True' : 'False'}`,
    `Loading=${loading ? 'True' : 'False'}`,
    ...(iconOnly
      ? []
      : [`Show L Icon=${iconLeft ? 'True' : 'False'}`, `Show R Icon=${iconRight ? 'True' : 'False'}`, `Subtitle=${subtitle ? 'True' : 'False'}`, `Dropdown=${dropdown ? 'True' : 'False'}`]),
  ].join('\n');

  const iconOptions = (
    <>
      <option value="">{c.none}</option>
      {Object.keys(ICONS).map((k) => (
        <option key={k} value={k}>
          {k}
        </option>
      ))}
    </>
  );

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>{preview}</div>
      <div className={styles.controls}>
        <label>
          {c.variant}
          <select value={variant} onChange={(e) => setVariant(e.target.value as 'solid' | 'ghost')}>
            <option value="solid">solid</option>
            <option value="ghost">ghost</option>
          </select>
        </label>
        <label>
          {c.tone}
          <select value={safeTone} onChange={(e) => setTone(e.target.value as ButtonTone)}>
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          {c.size}
          <select value={size} onChange={(e) => setSize(e.target.value as ButtonSize)}>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          {c.state}
          <select value={state} onChange={(e) => setState(e.target.value as State)}>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          {c.label}
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        {iconOnly ? (
          <label>
            {c.icon}
            <select value={onlyIcon} onChange={(e) => setOnlyIcon(e.target.value)}>
              {Object.keys(ICONS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <>
            <label>
              {c.subtitle}
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </label>
            <label>
              {c.iconLeft}
              <select value={iconLeft} onChange={(e) => setIconLeft(e.target.value)}>
                {iconOptions}
              </select>
            </label>
            <label>
              {c.iconRight}
              <select value={iconRight} onChange={(e) => setIconRight(e.target.value)}>
                {iconOptions}
              </select>
            </label>
          </>
        )}
        <div className={styles.toggles}>
          <label className={styles.check}>
            <input type="checkbox" checked={iconOnly} onChange={(e) => setIconOnly(e.target.checked)} /> {c.iconOnly}
          </label>
          {!iconOnly && (
            <label className={styles.check}>
              <input type="checkbox" checked={dropdown} onChange={(e) => setDropdown(e.target.checked)} /> {c.dropdown}
            </label>
          )}
          <label className={styles.check}>
            <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} /> {c.loading}
          </label>
          <label className={styles.check}>
            <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} /> {c.disabled}
          </label>
        </div>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figmaVariant : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
        {state !== 'default' && <p className={styles.note}>{c.stateNote}</p>}
      </div>
    </div>
  );
}
