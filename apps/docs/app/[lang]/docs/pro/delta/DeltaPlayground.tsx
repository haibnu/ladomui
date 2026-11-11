'use client';

import { useState } from 'react';
import { Delta, type DeltaProps } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Variant = NonNullable<DeltaProps['variant']>;
type Size = NonNullable<DeltaProps['size']>;

const COPY = {
  en: { variant: 'Variant', size: 'Size', label: 'Label', code: 'Code', vs: 'vs last month', colors: 'Chart colors', variants: { pill: 'Pill', plain: 'Plain' }, sizes: { medium: 'Medium', small: 'Small' } },
  tr: { variant: 'Görünüm', size: 'Boyut', label: 'Etiket', code: 'Kod', vs: 'geçen aya göre', colors: 'Grafik renkleri', variants: { pill: 'Hap', plain: 'Düz' }, sizes: { medium: 'Medium', small: 'Small' } },
};

// One of each: a good rise, a bad fall, a good fall (lower churn), no change.
const SAMPLES: Pick<DeltaProps, 'value' | 'direction' | 'tone'>[] = [
  { value: '+94.3%', direction: 'up' },
  { value: '−31.7%', direction: 'down' },
  { value: '−0.4%', direction: 'down', tone: 'success' },
  { value: '0.0%', direction: 'flat' },
];

export function DeltaPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [variant, setVariant] = useState<Variant>('pill');
  const [size, setSize] = useState<Size>('medium');
  const [label, setLabel] = useState(false);

  const code = `import { Delta } from '@ladom/ui/pro';\n\n<Delta value="+94.3%" direction="up"${variant === 'pill' ? ' variant="pill"' : ''}${size === 'small' ? ' size="small"' : ''}${label ? ` label="${c.vs}"` : ''} />\n<Delta value="−0.4%" direction="down" tone="success" />`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-large)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-medium)' }}>
            {SAMPLES.map((s, i) => (
              <Delta key={i} {...s} variant={variant} size={size} label={label ? c.vs : undefined} />
            ))}
          </div>
          {/* The six series colors, derived from the brand color: change it with Customize. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-tiny)' }} aria-label={c.colors}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <span
                key={n}
                title={`--color-chart-${n}`}
                style={{ inlineSize: 'var(--space-xlarge)', blockSize: 'var(--space-xlarge)', borderRadius: 'var(--radius-full)', background: `var(--color-chart-${n})` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.variant} value={variant} onChange={setVariant} options={[{ value: 'pill', label: c.variants.pill }, { value: 'plain', label: c.variants.plain }]} />
        <ControlSelect label={c.size} value={size} onChange={setSize} options={[{ value: 'medium', label: c.sizes.medium }, { value: 'small', label: c.sizes.small }]} />
        <ControlCheck label={c.label} checked={label} onChange={setLabel} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
