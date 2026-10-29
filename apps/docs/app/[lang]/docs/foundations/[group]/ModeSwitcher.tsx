'use client';

import { useEffect, useId, useState } from 'react';
import { Segment } from '@ladom/ui';
import { useLocale } from '@/components/useLocale';
import styles from './page.module.css';

// Each switch sets a data attribute on <html>; "auto" removes it (device: by screen width, density: Comfort).
// The theme has its own toggle in the top bar. Forced modes are cleared when leaving the page.
// Option names are the Figma mode names; auto is the first option.
const SWITCHES = [
  { attr: 'data-device', label: 'device', auto: true, options: [['desktop', 'Desktop'], ['tablet', 'Tablet'], ['mobile', 'Mobile']] },
  { attr: 'data-density', label: 'density', auto: false, options: [['', 'Comfort'], ['narrow', 'Narrow']] },
] as const;

export function ModeSwitcher() {
  const [values, setValues] = useState<Record<string, string>>({});
  const { t } = useLocale();
  const id = useId();

  useEffect(() => {
    const html = document.documentElement;
    for (const { attr } of SWITCHES) {
      const value = values[attr];
      if (value) html.setAttribute(attr, value);
      else html.removeAttribute(attr);
    }
  }, [values]);

  useEffect(() => () => SWITCHES.forEach(({ attr }) => document.documentElement.removeAttribute(attr)), []);

  return (
    <div className={styles.switcher}>
      {SWITCHES.map(({ attr, label, auto, options }) => (
        <div key={attr} className={styles.switch}>
          <span id={`${id}-${attr}`}>{t.foundations[label]}</span>
          <Segment
            size="small"
            aria-labelledby={`${id}-${attr}`}
            name={`${id}-${attr}`}
            // Segment needs a non-empty value; '' (auto / Comfort) is stored as 'auto'.
            value={values[attr] || 'auto'}
            onChange={(v) => setValues((s) => ({ ...s, [attr]: v === 'auto' ? '' : v }))}
            options={[
              ...(auto ? [{ value: 'auto', label: t.foundations.auto }] : []),
              ...options.map(([value, name]) => ({ value: value || 'auto', label: name })),
            ]}
          />
        </div>
      ))}
    </div>
  );
}
