'use client';

import { useLocale } from '../useLocale';
import { CustomizePanel } from './CustomizePanel';
import { setOpen, useCustomize } from './store';
import styles from './customize.module.css';

/** "Customize" in the top bar: a dot in the current brand color, and the panel it opens. */
export function CustomizeButton() {
  const { t } = useLocale();
  const { theme } = useCustomize();
  return (
    <>
      {/* A key like the landing page buttons, with a shine passing over it now and then. */}
      <button type="button" className={styles.key} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className={styles.dot} style={{ background: theme.brand }} aria-hidden />
        <span className={styles.buttonLabel}>{t.customize.button}</span>
      </button>
      <CustomizePanel />
    </>
  );
}
