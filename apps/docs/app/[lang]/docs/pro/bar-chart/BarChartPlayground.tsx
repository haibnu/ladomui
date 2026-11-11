'use client';

import { useState } from 'react';
import { IconRefresh } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { BarChart } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Shape = 'single' | 'grouped' | 'stacked';

const COPY = {
  en: {
    shape: 'Series',
    shapes: { single: 'One series', grouped: 'Grouped', stacked: 'Stacked' },
    legend: 'Legend',
    tooltip: 'Tooltip',
    replay: 'Play again',
    code: 'Code',
    title: 'Hires and exits per month',
    single: 'Payroll cost per month',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    names: ['Hires', 'Exits', 'Transfers'],
  },
  tr: {
    shape: 'Seriler',
    shapes: { single: 'Tek seri', grouped: 'Gruplu', stacked: 'Yığılmış' },
    legend: 'Lejant',
    tooltip: 'İpucu',
    replay: 'Tekrar oynat',
    code: 'Kod',
    title: 'Aylara göre işe giriş ve çıkışlar',
    single: 'Aylara göre bordro maliyeti',
    months: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    names: ['İşe giriş', 'Çıkış', 'Transfer'],
  },
};

const HIRES = [8, 12, 6, 14, 9, 11, 7, 13, 10, 15, 12, 9];
const EXITS = [3, 5, 4, 2, 6, 3, 5, 4, 7, 3, 4, 6];
const MOVES = [1, 2, 1, 3, 2, 1, 2, 2, 1, 3, 2, 1];
const COST = [1621, 1702, 1668, 1745, 1731, 1802, 1786, 1859, 1842, 1931, 1904, 2049].map((k) => k * 1000);

export function BarChartPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [shape, setShape] = useState<Shape>('grouped');
  const [legend, setLegend] = useState(true);
  const [tooltip, setTooltip] = useState(true);
  const [run, setRun] = useState(0);
  const money = (n: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);

  const single = shape === 'single';
  const series = single
    ? [{ name: c.single, data: COST }]
    : [
        { name: c.names[0]!, data: HIRES },
        { name: c.names[1]!, data: EXITS },
        ...(shape === 'stacked' ? [{ name: c.names[2]!, data: MOVES }] : []),
      ];
  const code = `import { BarChart } from '@ladom/ui/pro';\n\n<BarChart\n  title="${single ? c.single : c.title}"\n  categories={months}\n  series={[\n${series.map((s) => `    { name: '${s.name}', data: [${s.data.slice(0, 3).join(', ')}, …] },`).join('\n')}\n  ]}${shape === 'stacked' ? '\n  mode="stacked"' : ''}${single ? '\n  format={formatMoney}' : ''}${legend ? '' : '\n  legend={false}'}${tooltip ? '' : '\n  tooltip={false}'}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div key={run} style={{ inlineSize: '100%' }}>
          <BarChart
            title={single ? c.single : c.title}
            categories={c.months}
            series={series}
            mode={shape === 'stacked' ? 'stacked' : 'grouped'}
            format={single ? money : undefined}
            legend={legend}
            tooltip={tooltip}
            locale={lang === 'tr' ? 'tr-TR' : 'en-US'}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect
          label={c.shape}
          value={shape}
          onChange={setShape}
          options={(Object.keys(c.shapes) as Shape[]).map((k) => ({ value: k, label: c.shapes[k] }))}
        />
        <ControlCheck label={c.legend} checked={legend} onChange={setLegend} />
        <ControlCheck label={c.tooltip} checked={tooltip} onChange={setTooltip} />
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
