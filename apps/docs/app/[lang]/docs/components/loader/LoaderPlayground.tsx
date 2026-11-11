'use client';

import { useState } from 'react';
import { Loader, type LoaderTone } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Variant = 'infinite' | 'finite' | 'brand';
const TONES: LoaderTone[] = ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'info'];
const FIGMA_STYLE: Record<LoaderTone, string> = { primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', success: 'Success', error: 'Danger', warning: 'Warning', info: 'Information' };
const COPY = {
  en: { variant: 'Variant', tone: 'Tone', value: 'Value', text: 'With text', figma: 'Figma variant', code: 'Code' },
  tr: { variant: 'Tip', tone: 'Ton', value: 'Değer', text: 'Metinli', figma: 'Figma varyantı', code: 'Kod' },
};

export function LoaderPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [variant, setVariant] = useState<Variant>('infinite');
  const [tone, setTone] = useState<LoaderTone>('primary');
  const [value, setValue] = useState(54);
  const [withText, setWithText] = useState(true);

  const percent = lang === 'tr' ? `%${value}` : `${value}%`;
  const loaded = `${Math.round((98 * value) / 100)} Mb`;
  const preview =
    variant === 'finite' ? (
      <div style={{ inlineSize: '100%', maxInlineSize: 382 }}>
        <Loader variant="finite" tone={tone} value={value} {...(withText ? { valueText: percent, loaded, total: '98 Mb' } : {})} />
      </div>
    ) : variant === 'brand' ? (
      <Loader variant="brand" />
    ) : (
      <Loader tone={tone} />
    );

  const props =
    variant === 'finite'
      ? ['variant="finite"', tone !== 'primary' && `tone="${tone}"`, `value={${value}}`, ...(withText ? [`valueText="${percent}"`, `loaded="${loaded}"`, 'total="98 Mb"'] : [])]
      : variant === 'brand'
        ? ['variant="brand"']
        : [tone !== 'primary' && `tone="${tone}"`];
  const code = `import { Loader } from '@ladom/ui';\n\n<Loader${props.filter(Boolean).map((p) => ` ${p}`).join('')} />`;
  const type = variant === 'finite' ? (withText ? 'Finitive with Text' : 'Finitive') : variant === 'brand' ? 'Brand' : 'Infinitive';
  const figma = `🎛 Type=${type}\nStyle=${variant === 'brand' ? 'Primary' : FIGMA_STYLE[tone]}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>{preview}</div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.variant} value={variant} options={['infinite', 'finite', 'brand'] as const} onChange={setVariant} />
        {variant !== 'brand' && <ControlSelect label={c.tone} value={tone} options={TONES} onChange={setTone} />}
        {variant === 'finite' && (
          <>
            <label>
              {c.value}
              <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />
            </label>
            <ControlCheck label={c.text} checked={withText} onChange={setWithText} />
          </>
        )}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
