'use client';

import { useLocale } from '../useLocale';
import { setOpen, setTheme, useCustomize } from './store';
import { PRESETS } from './theme';
import styles from './customize.module.css';

// The theme row at the top of every playground's controls: a few brand colors and a link to the
// Customize panel. It changes the site-wide theme, not this component, so the choice follows the
// reader from page to page.
export function ThemeRow() {
  const { t } = useLocale();
  const c = t.customize;
  const { theme } = useCustomize();
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{c.row}</span>
      <span className={styles.rowSwatches} role="group" aria-label={c.brand}>
        {PRESETS.slice(0, 6).map((hex) => (
          <button
            key={hex}
            type="button"
            className={styles.mini}
            style={{ background: hex }}
            aria-label={c.swatch(hex)}
            aria-pressed={theme.brand === hex}
            onClick={() => setTheme({ brand: hex })}
          />
        ))}
      </span>
      <button type="button" className={styles.rowLink} onClick={() => setOpen(true)}>
        {c.change}
      </button>
    </div>
  );
}
