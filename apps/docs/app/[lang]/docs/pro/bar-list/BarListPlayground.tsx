'use client';

import { useId, useState } from 'react';
import { BarList, Card, Meter } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlNumber, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: {
    variant: 'Variant',
    variants: { track: 'Track', row: 'Row (table)' },
    title: 'Headcount by department',
    columns: ['Department', 'Employees', 'New this year'],
    percent: 'Show shares',
    fixedMax: 'Max = total',
    meter: 'Meter',
    checkedIn: 'Checked in today',
    code: 'Code',
    of: 'of',
    departments: ['Engineering', 'Sales', 'Operations', 'People', 'Finance'],
  },
  tr: {
    variant: 'Görünüm',
    variants: { track: 'Çubuk', row: 'Satır (tablo)' },
    title: 'Departmanlara göre çalışanlar',
    columns: ['Departman', 'Çalışan', 'Bu yıl katılan'],
    percent: 'Payları göster',
    fixedMax: 'Max = toplam',
    meter: 'Meter',
    checkedIn: 'Bugün giriş yapan',
    code: 'Kod',
    of: '/',
    departments: ['Mühendislik', 'Satış', 'Operasyon', 'İnsan Kaynakları', 'Finans'],
  },
};

const COUNTS = [6, 4, 3, 2, 1];
const NEW = [2, 1, 0, 1, 0];
const TOTAL = COUNTS.reduce((a, b) => a + b, 0);

export function BarListPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [variant, setVariant] = useState<'track' | 'row'>('track');
  const [percent, setPercent] = useState(false);
  const [fixedMax, setFixedMax] = useState(false);
  const [meter, setMeter] = useState(true);
  const [checkedIn, setCheckedIn] = useState(12);
  const meterLabel = useId();

  const pct = new Intl.NumberFormat(lang, { style: 'percent' });
  const items = c.departments.map((label, i) => ({ key: label, label, value: COUNTS[i] ?? 0, display: percent ? pct.format((COUNTS[i] ?? 0) / TOTAL) : undefined, values: variant === 'row' ? [NEW[i]] : undefined }));

  const row = variant === 'row';
  const code = `import { BarList${meter ? ', Meter' : ''}${row ? ', Card' : ''} } from '@ladom/ui/pro';\n\n${row ? `<Card title="${c.title}">\n` : ''}<BarList${row ? `\n  variant="row"\n  columns={['${c.columns.join("', '")}']}` : ''}\n  items={[\n    { label: '${c.departments[0]}', value: 6${percent ? ", display: '38%'" : ''}${row ? ', values: [2]' : ''} },\n    { label: '${c.departments[1]}', value: 4${percent ? ", display: '25%'" : ''}${row ? ', values: [1]' : ''} },\n    // …\n  ]}${fixedMax ? `\n  max={${TOTAL}}` : ''}\n/>${row ? '\n</Card>' : ''}${meter ? `\n\n<Meter value={${checkedIn}} max={${TOTAL}} aria-label="Checked in today" />` : ''}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-large)', inlineSize: '100%', maxInlineSize: row ? 'var(--grid-column-6)' : 'var(--grid-column-4)' }}>
          {row ? (
            <Card title={c.title}>
              <BarList key={`row-${percent}`} variant="row" columns={c.columns} items={items} max={fixedMax ? TOTAL : undefined} />
            </Card>
          ) : (
            <BarList key="track" items={items} max={fixedMax ? TOTAL : undefined} />
          )}
          {meter && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-tiny)' }}>
              <span id={meterLabel}>
                {c.checkedIn}: {checkedIn} {c.of} {TOTAL}
              </span>
              <Meter value={checkedIn} max={TOTAL} aria-labelledby={meterLabel} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect
          label={c.variant}
          value={variant}
          onChange={setVariant}
          options={[
            { value: 'track', label: c.variants.track },
            { value: 'row', label: c.variants.row },
          ]}
        />
        <ControlCheck label={c.percent} checked={percent} onChange={setPercent} />
        <ControlCheck label={c.fixedMax} checked={fixedMax} onChange={setFixedMax} />
        <ControlCheck label={c.meter} checked={meter} onChange={setMeter} />
        {meter && <ControlNumber label={c.checkedIn} value={checkedIn} onChange={setCheckedIn} min={0} max={TOTAL} />}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
