'use client';

import { useState } from 'react';
import { IconRefresh } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { FunnelChart } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: {
    deltas: 'Changes',
    captions: 'Captions',
    tooltip: 'Tooltip',
    replay: 'Play again',
    code: 'Code',
    title: 'Hiring funnel',
    stages: ['Candidates', 'Interviewed', 'Offers', 'Hired'],
    caption: (n: number, s: string) => `${n} ${s.toLowerCase()}`,
    ofFirst: 'of candidates',
    ofPrevious: 'of the stage before',
  },
  tr: {
    deltas: 'Değişimler',
    captions: 'Alt yazılar',
    tooltip: 'İpucu',
    replay: 'Tekrar oynat',
    code: 'Kod',
    title: 'İşe alım hunisi',
    stages: ['Aday', 'Görüşülen', 'Teklif', 'İşe alınan'],
    caption: (n: number, s: string) => `${n} ${s.toLocaleLowerCase('tr')}`,
    ofFirst: 'adayların',
    ofPrevious: 'önceki aşamanın',
  },
};

const VALUES = [126, 18, 3, 2];
const DELTAS = [
  { value: '12.0%', direction: 'up' },
  { value: '4.5%', direction: 'down' },
  { value: '5.5%', direction: 'up' },
  { value: '10.3%', direction: 'down' },
] as const;

export function FunnelChartPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [deltas, setDeltas] = useState(true);
  const [captions, setCaptions] = useState(true);
  const [tooltip, setTooltip] = useState(true);
  const [run, setRun] = useState(0);

  const stages = c.stages.map((name, i) => ({
    name,
    value: VALUES[i]!,
    delta: deltas ? DELTAS[i] : undefined,
    caption: captions ? c.caption(VALUES[i]!, name) : undefined,
  }));
  const code = `import { FunnelChart } from '@ladom/ui/pro';\n\n<FunnelChart\n  title="${c.title}"\n  stages={[\n${stages.map((s) => `    { name: '${s.name}', value: ${s.value}${s.delta ? `, delta: { value: '${s.delta.value}', direction: '${s.delta.direction}' }` : ''}${s.caption ? `, caption: '${s.caption}'` : ''} },`).join('\n')}\n  ]}${tooltip ? '' : '\n  tooltip={false}'}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div key={run} style={{ inlineSize: '100%' }}>
          <FunnelChart title={c.title} stages={stages} tooltip={tooltip} labels={{ ofFirst: c.ofFirst, ofPrevious: c.ofPrevious }} locale={lang === 'tr' ? 'tr-TR' : 'en-US'} />
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.deltas} checked={deltas} onChange={setDeltas} />
        <ControlCheck label={c.captions} checked={captions} onChange={setCaptions} />
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
