'use client';

import { useState } from 'react';
import { TimePicker, type TimeValue } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { seconds: 'Seconds', step: 'Step', office: 'Office hours only (09–18)', figma: 'Figma variant', code: 'Code', chosen: 'Chosen', none: 'nothing yet', labels: { hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' } },
  tr: { seconds: 'Saniye', step: 'Adım', office: 'Yalnızca mesai saatleri (09–18)', figma: 'Figma varyantı', code: 'Kod', chosen: 'Seçilen', none: 'henüz yok', labels: { hours: 'Saat', minutes: 'Dakika', seconds: 'Saniye' } },
};
const pad = (n = 0) => String(n).padStart(2, '0');

export function TimePickerPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [seconds, setSeconds] = useState(true);
  const [step, setStep] = useState(1);
  const [office, setOffice] = useState(true);
  const [value, setValue] = useState<TimeValue | null>({ hours: 9, minutes: 30, seconds: 0 });

  const props = ['value={time}', 'onChange={setTime}', !seconds && 'showSeconds={false}', step !== 1 && `step={${step}}`, office && "isDisabled={(unit, v) => unit === 'hours' && (v < 9 || v > 18)}"].filter(Boolean);
  const code = `import { TimePicker } from '@ladom/ui';\n\n<TimePicker${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const figma = `Time Picker\n\n.timepicker item\nProperty 1=Default | hover | selected | disable`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ flexDirection: 'column', gap: 'var(--space-medium)' }}>
        <TimePicker
          value={value}
          onChange={setValue}
          showSeconds={seconds}
          step={step}
          labels={c.labels}
          isDisabled={office ? (unit, v) => unit === 'hours' && (v < 9 || v > 18) : undefined}
        />
        <p style={{ margin: 0, font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>
          {c.chosen}: {value ? `${pad(value.hours)}:${pad(value.minutes)}${seconds ? `:${pad(value.seconds)}` : ''}` : c.none}
        </p>
      </div>
      <div className={styles.controls}>
        <label>
          {c.step}
          <select value={step} onChange={(e) => setStep(Number(e.target.value))}>
            <option>1</option>
            <option>5</option>
            <option>15</option>
          </select>
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={seconds} onChange={(e) => setSeconds(e.target.checked)} /> {c.seconds}
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={office} onChange={(e) => setOffice(e.target.checked)} /> {c.office}
        </label>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
