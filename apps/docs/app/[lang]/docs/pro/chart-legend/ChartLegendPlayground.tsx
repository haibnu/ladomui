'use client';

import { useState } from 'react';
import { ChartLegend } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { headings: 'Headings', second: 'Second value', delta: 'Change', code: 'Code', columns: ['Team', 'November', 'October', 'Change'], names: ['Engineering', 'Sales', 'Operations'] },
  tr: { headings: 'Başlıklar', second: 'İkinci değer', delta: 'Değişim', code: 'Kod', columns: ['Ekip', 'Kasım', 'Ekim', 'Değişim'], names: ['Mühendislik', 'Satış', 'Operasyon'] },
};

const NOV = [1798190, 1732410, 1250590];
const OCT = [1636260, 1220350, 1351250];

export function ChartLegendPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [headings, setHeadings] = useState(true);
  const [second, setSecond] = useState(true);
  const [delta, setDelta] = useState(true);
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);
  const pct = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' });

  const items = c.names.map((name, i) => {
    const change = NOV[i]! / OCT[i]! - 1;
    return {
      name,
      values: [money(NOV[i]!), ...(second ? [money(OCT[i]!)] : [])],
      delta: delta ? { value: pct.format(change), direction: change >= 0 ? ('up' as const) : ('down' as const) } : undefined,
    };
  });
  const columns = headings ? [c.columns[0], c.columns[1], ...(second ? [c.columns[2]] : []), ...(delta ? [c.columns[3]] : [])] : undefined;
  const code = `import { ChartLegend } from '@ladom/ui/pro';\n\n<ChartLegend${headings ? `\n  columns={[${columns!.map((x) => `'${x}'`).join(', ')}]}` : ''}\n  items={[\n    { name: '${c.names[0]}', values: ['${money(NOV[0]!)}'${second ? `, '${money(OCT[0]!)}'` : ''}]${delta ? ", delta: { value: '+9.9%', direction: 'up' }" : ''} },\n    // …\n  ]}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <ChartLegend style={{ inlineSize: '100%', maxInlineSize: 'var(--grid-column-6)' }} columns={columns} items={items} />
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.headings} checked={headings} onChange={setHeadings} />
        <ControlCheck label={c.second} checked={second} onChange={setSecond} />
        <ControlCheck label={c.delta} checked={delta} onChange={setDelta} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
