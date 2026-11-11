'use client';

import { useState } from 'react';
import { IconRefresh } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { ChartLegend, DonutChart, type DonutChartProps } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Size = NonNullable<DonutChartProps['size']>;

const COPY = {
  en: {
    size: 'Size',
    sizes: { small: 'Small', medium: 'Medium', large: 'Large' },
    center: 'Center total',
    multiples: 'Small multiples',
    replay: 'Play again',
    code: 'Code',
    title: 'Payroll by department',
    total: 'Total',
    names: ['Engineering', 'Sales', 'Operations'],
    months: ['Aug', 'Sep', 'Oct', 'Nov'],
  },
  tr: {
    size: 'Boyut',
    sizes: { small: 'Small', medium: 'Medium', large: 'Large' },
    center: 'Ortada toplam',
    multiples: 'Küçük çoklular',
    replay: 'Tekrar oynat',
    code: 'Kod',
    title: 'Departmanlara göre bordro',
    total: 'Toplam',
    names: ['Mühendislik', 'Satış', 'Operasyon'],
    months: ['Ağu', 'Eyl', 'Eki', 'Kas'],
  },
};

const VALUES = [1798190, 1732410, 1250590];
const MONTHLY = [
  [52, 30, 18],
  [40, 38, 22],
  [64, 20, 16],
  [35, 45, 20],
];

export function DonutChartPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [size, setSize] = useState<Size>('large');
  const [center, setCenter] = useState(true);
  const [multiples, setMultiples] = useState(true);
  const [run, setRun] = useState(0);
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);
  const short = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'TRY', notation: 'compact', maximumFractionDigits: 2 }).format(n);
  const data = c.names.map((name, i) => ({ name, value: VALUES[i]! }));
  const total = VALUES.reduce((a, b) => a + b, 0);

  const code = `import { ChartLegend, DonutChart } from '@ladom/ui/pro';\n\n<DonutChart\n  title="${c.title}"\n  size="${size}"\n  data={[\n    { name: '${c.names[0]}', value: 1798190 },\n    { name: '${c.names[1]}', value: 1732410 },\n    { name: '${c.names[2]}', value: 1250590 },\n  ]}${center ? `\n  label="${short(total)}"\n  sublabel="${c.total}"` : ''}\n  format={formatMoney}\n/>\n<ChartLegend items={[{ name: '${c.names[0]}', values: ['${money(VALUES[0]!)}'] }, …]} />`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div key={run} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xlarge)', inlineSize: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-xlarge)' }}>
            <DonutChart title={c.title} size={size} data={data} label={center ? short(total) : undefined} sublabel={center ? c.total : undefined} format={money} locale={locale} />
            <ChartLegend style={{ flex: '1 1 var(--grid-column-3)' }} items={data.map((d) => ({ name: d.name, values: [money(d.value)] }))} />
          </div>
          {multiples && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(3 * var(--space-xxlarge)), 1fr))', gap: 'var(--space-medium)', justifyItems: 'center' }}>
              {MONTHLY.map((m, i) => (
                <DonutChart key={i} title={`${c.title} · ${c.months[i]}`} size="small" caption={c.months[i]} data={c.names.map((name, j) => ({ name, value: m[j]! }))} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.size} value={size} onChange={setSize} options={(Object.keys(c.sizes) as Size[]).map((k) => ({ value: k, label: c.sizes[k] }))} />
        <ControlCheck label={c.center} checked={center} onChange={setCenter} />
        <ControlCheck label={c.multiples} checked={multiples} onChange={setMultiples} />
        <Button size="small" variant="ghost" tone="secondary" iconLeft={IconRefresh} onClick={() => setRun(run + 1)}>
          {c.replay}
        </Button>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
