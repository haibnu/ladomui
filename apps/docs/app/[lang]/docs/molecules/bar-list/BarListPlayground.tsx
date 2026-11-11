'use client';

import { useId, useState } from 'react';
import { BarList, Meter } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlNumber } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: {
    percent: 'Show shares',
    fixedMax: 'Max = total',
    meter: 'Meter',
    checkedIn: 'Checked in today',
    code: 'Code',
    of: 'of',
    departments: ['Engineering', 'Sales', 'Operations', 'People', 'Finance'],
  },
  tr: {
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
const TOTAL = COUNTS.reduce((a, b) => a + b, 0);

export function BarListPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [percent, setPercent] = useState(false);
  const [fixedMax, setFixedMax] = useState(false);
  const [meter, setMeter] = useState(true);
  const [checkedIn, setCheckedIn] = useState(12);
  const meterLabel = useId();

  const pct = new Intl.NumberFormat(lang, { style: 'percent' });
  const items = c.departments.map((label, i) => ({ key: label, label, value: COUNTS[i] ?? 0, display: percent ? pct.format((COUNTS[i] ?? 0) / TOTAL) : undefined }));

  const code = `import { BarList${meter ? ', Meter' : ''} } from '@ladom/ui/pro';\n\n<BarList\n  items={[\n    { label: 'Engineering', value: 6${percent ? ", display: '38%'" : ''} },\n    { label: 'Sales', value: 4${percent ? ", display: '25%'" : ''} },\n    // …\n  ]}${fixedMax ? `\n  max={${TOTAL}}` : ''}\n/>${meter ? `\n\n<Meter value={${checkedIn}} max={${TOTAL}} aria-label="Checked in today" />` : ''}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-large)', inlineSize: '100%', maxInlineSize: 'var(--grid-column-4)' }}>
          <BarList items={items} max={fixedMax ? TOTAL : undefined} />
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
