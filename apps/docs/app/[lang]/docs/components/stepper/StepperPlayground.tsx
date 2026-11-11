'use client';

import { useState } from 'react';
import { Button, Stepper } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { count: 'Steps', figma: 'Figma variant', code: 'Code', back: 'Back', next: 'Next', steps: ['Account', 'Profile', 'Team', 'Billing', 'Review', 'Done'] },
  tr: { count: 'Adım', figma: 'Figma varyantı', code: 'Kod', back: 'Geri', next: 'İleri', steps: ['Hesap', 'Profil', 'Ekip', 'Fatura', 'Kontrol', 'Bitti'] },
};

export function StepperPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [count, setCount] = useState(4);
  const [current, setCurrent] = useState(1);
  const steps = c.steps.slice(0, count);
  const at = Math.min(current, count - 1);

  const code = `import { Stepper } from '@ladom/ui';\n\n<Stepper\n  aria-label="Sign-up"\n  steps={[${steps.map((s) => `'${s}'`).join(', ')}]}\n  current={${at}}\n/>`;
  const figma = steps.map((_, i) => `Stepper Item ${i + 1}: 🕹 State=${i < at ? 'Success' : i === at ? 'Current' : 'Next'}`).join('\n');

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ flexDirection: 'column', gap: 'var(--space-large)' }}>
        <Stepper aria-label="Sign-up" steps={steps} current={at} />
        <div style={{ display: 'flex', gap: 'var(--space-tiny)' }}>
          <Button variant="ghost" tone="tertiary" size="small" disabled={at === 0} onClick={() => setCurrent(at - 1)}>
            {c.back}
          </Button>
          <Button size="small" disabled={at === count - 1} onClick={() => setCurrent(at + 1)}>
            {c.next}
          </Button>
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.count} value={String(count)} options={[2, 3, 4, 5, 6].map(String)} onChange={(v) => setCount(Number(v))} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
