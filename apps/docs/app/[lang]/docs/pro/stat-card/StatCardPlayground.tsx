'use client';

import { useState } from 'react';
import { IconRefresh } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { StatCard, type StatCardProps } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Kind = NonNullable<StatCardProps['chart']>;
type Layout = NonNullable<StatCardProps['layout']>;

const COPY = {
  en: {
    layout: 'Layout',
    layouts: { vertical: 'Vertical', horizontal: 'Horizontal' },
    chart: 'Chart',
    mixed: 'One of each',
    kinds: { area: 'Area', line: 'Line with points', step: 'Steps', bars: 'Bars' },
    delta: 'Change',
    unit: 'Unit',
    hover: 'Hover tooltip',
    replay: 'Play again',
    code: 'Code',
    vs: 'vs last month',
    days: 'days',
    weeks: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    stats: [
      { label: 'Total payroll', value: 2048850, unit: '₺', unitFirst: true },
      { label: 'Approval rate', value: 86.7, unit: '%' },
      { label: 'Avg. leave length', value: 1.8, unit: 'days' },
      { label: 'Employees', value: 128 },
    ],
  },
  tr: {
    layout: 'Düzen',
    layouts: { vertical: 'Dikey', horizontal: 'Yatay' },
    chart: 'Grafik',
    mixed: 'Hepsinden bir',
    kinds: { area: 'Alan', line: 'Noktalı çizgi', step: 'Basamak', bars: 'Çubuk' },
    delta: 'Değişim',
    unit: 'Birim',
    hover: 'Hover ipucu',
    replay: 'Tekrar oynat',
    code: 'Kod',
    vs: 'geçen aya göre',
    days: 'gün',
    weeks: ['Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May'],
    stats: [
      { label: 'Toplam bordro', value: 2048850, unit: '₺', unitFirst: true },
      { label: 'Onay oranı', value: 86.7, unit: '%' },
      { label: 'Ortalama izin süresi', value: 1.8, unit: 'gün' },
      { label: 'Çalışanlar', value: 128 },
    ],
  },
} as const;

// Sample series and changes, one per card.
const SERIES = [
  [1621000, 1702000, 1668000, 1745000, 1731000, 1802000, 1786000, 1859000, 1842000, 1931000, 1904000, 2048850],
  [78.2, 81.4, 79.1, 84.6, 80.3, 79.5, 82.8, 76.4, 83.9, 86.1, 84.2, 86.7],
  [3.1, 2.8, 2.9, 2.4, 2.6, 2.2, 2.3, 2.0, 2.1, 1.9, 2.0, 1.8],
  [96, 98, 101, 104, 104, 109, 112, 115, 118, 121, 125, 128],
];
const DELTAS = [
  { value: '+12.4%', direction: 'up' },
  { value: '+2.1%', direction: 'up' },
  { value: '−0.3', direction: 'down', tone: 'success' },
  { value: '+8', direction: 'up' },
] as const;
const MIXED: Kind[] = ['area', 'bars', 'step', 'line'];
const TONES = ['primary', 'success', 'warning', 'primary'] as const;

export function StatCardPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [layout, setLayout] = useState<Layout>('vertical');
  const [chart, setChart] = useState<Kind | 'mixed'>('mixed');
  const [delta, setDelta] = useState(true);
  const [unit, setUnit] = useState(true);
  const [hover, setHover] = useState(true);
  const [run, setRun] = useState(0);

  const kind = (i: number) => (chart === 'mixed' ? MIXED[i]! : chart);
  const attrs = [
    `  label="${c.stats[1].label}"`,
    '  value={86.7}',
    unit && '  unit="%"',
    delta && `  delta={{ value: '+2.1%', direction: 'up', label: '${c.vs}' }}`,
    '  data={[78.2, 81.4, 79.1, 84.6, 80.3, 79.5, 82.8, 76.4, 83.9, 86.1, 84.2, 86.7]}',
    `  chart="${kind(1)}"`,
    '  tone="success"',
    `  layout="${layout}"`,
    hover && '  labels={months}\n  hover',
  ].filter(Boolean);
  const code = `import { StatCard } from '@ladom/ui/pro';\n\n<StatCard\n${attrs.join('\n')}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div
          key={run}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${layout === 'horizontal' ? 'var(--grid-column-3)' : 'var(--grid-column-2)'}, 1fr))`,
            gap: 'var(--space-medium)',
            inlineSize: '100%',
          }}
        >
          {c.stats.map((s, i) => {
            const money = 'unitFirst' in s;
            return (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                format={money ? (n) => `₺${new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 0 }).format(n)}` : undefined}
                unit={unit && !money && 'unit' in s ? s.unit : undefined}
                delta={delta ? { ...DELTAS[i]!, label: c.vs } : undefined}
                data={[...SERIES[i]!]}
                chart={kind(i)}
                tone={TONES[i]}
                layout={layout}
                labels={[...c.weeks]}
                hover={hover}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect
          label={c.layout}
          value={layout}
          onChange={setLayout}
          options={[
            { value: 'vertical', label: c.layouts.vertical },
            { value: 'horizontal', label: c.layouts.horizontal },
          ]}
        />
        <ControlSelect
          label={c.chart}
          value={chart}
          onChange={setChart}
          options={[{ value: 'mixed', label: c.mixed }, ...(Object.keys(c.kinds) as Kind[]).map((k) => ({ value: k, label: c.kinds[k] }))]}
        />
        <ControlCheck label={c.delta} checked={delta} onChange={setDelta} />
        <ControlCheck label={c.unit} checked={unit} onChange={setUnit} />
        <ControlCheck label={c.hover} checked={hover} onChange={setHover} />
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
