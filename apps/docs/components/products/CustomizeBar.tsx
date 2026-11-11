'use client';

import { IconArrowRight } from '@ladom/icons';
import { useLocale } from '../useLocale';
import { CustomizePanel } from '../customize/CustomizePanel';
import { setOpen, useCustomize } from '../customize/store';
import styles from './products.module.css';

/** The black bar on top of a product demo: it opens Customize, so the demo takes your brand color. */
export function CustomizeBar() {
  const { t } = useLocale();
  const { theme } = useCustomize();
  return (
    <>
      <button type="button" className={styles.customizeBar} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className={styles.customizeDot} style={{ background: theme.brand }} aria-hidden />
        {t.products.customizeBar}
        <IconArrowRight size={16} aria-hidden />
      </button>
      <CustomizePanel />
    </>
  );
}
