'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

// Each switch sets a data attribute on <html>; "auto" removes it (theme: Light, device: by screen width, density: Comfort).
const SWITCHES = [
  { attr: 'data-theme', label: 'Theme', options: ['dark'] },
  { attr: 'data-device', label: 'Device', options: ['desktop', 'tablet', 'mobile'] },
  { attr: 'data-density', label: 'Density', options: ['narrow'] },
] as const;

export function ModeSwitcher() {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const html = document.documentElement;
    for (const { attr } of SWITCHES) {
      const value = values[attr];
      if (value) html.setAttribute(attr, value);
      else html.removeAttribute(attr);
    }
  }, [values]);

  return (
    <div className={styles.switcher}>
      {SWITCHES.map(({ attr, label, options }) => (
        <label key={attr}>
          {label}{' '}
          <select value={values[attr] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [attr]: e.target.value }))}>
            <option value="">auto</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
