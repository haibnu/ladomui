'use client';

import { useState } from 'react';
import { IconContacts, IconDateRange, IconLead } from '@ladom/icons';
import { Badge } from '@ladom/ui';
import { StatCard } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: {
    icon: 'Icon',
    trend: 'Trend',
    note: 'Note',
    code: 'Code',
    stats: [
      { label: 'Employees', value: '16', trend: '+2', tone: 'success', note: '2 joined this month' },
      { label: 'On leave today', value: '2', trend: '−1', tone: 'default', note: 'Back on Monday' },
      { label: 'Open positions', value: '3', trend: 'New', tone: 'primary', note: '41 applications' },
    ],
  },
  tr: {
    icon: 'İkon',
    trend: 'Değişim',
    note: 'Not',
    code: 'Kod',
    stats: [
      { label: 'Çalışanlar', value: '16', trend: '+2', tone: 'success', note: 'Bu ay 2 kişi katıldı' },
      { label: 'Bugün izinde', value: '2', trend: '−1', tone: 'default', note: 'Pazartesi dönüyorlar' },
      { label: 'Açık pozisyonlar', value: '3', trend: 'Yeni', tone: 'primary', note: '41 başvuru' },
    ],
  },
} as const;

const ICONS = [IconContacts, IconDateRange, IconLead];

export function StatCardPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [icon, setIcon] = useState(true);
  const [trend, setTrend] = useState(true);
  const [note, setNote] = useState(true);

  const attrs = [
    '  label="Employees"',
    '  value="16"',
    icon && '  icon={<IconContacts />}',
    trend && '  trend={<Badge size="small" tone="success">+2</Badge>}',
    note && '  note="2 joined this month"',
  ].filter(Boolean);
  const code = `import { Badge } from '@ladom/ui';\nimport { StatCard } from '@ladom/ui/pro';\n\n<StatCard\n${attrs.join('\n')}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-medium)', inlineSize: '100%' }}>
          {c.stats.map((s, i) => {
            const Icon = ICONS[i] ?? IconContacts;
            return (
              <StatCard
                key={s.label}
                style={{ flex: '1 1 var(--grid-column-2)', maxInlineSize: 'var(--grid-column-3)' }}
                label={s.label}
                value={s.value}
                icon={icon ? <Icon /> : undefined}
                trend={
                  trend ? (
                    <Badge size="small" tone={s.tone}>
                      {s.trend}
                    </Badge>
                  ) : undefined
                }
                note={note ? s.note : undefined}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.icon} checked={icon} onChange={setIcon} />
        <ControlCheck label={c.trend} checked={trend} onChange={setTrend} />
        <ControlCheck label={c.note} checked={note} onChange={setNote} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
