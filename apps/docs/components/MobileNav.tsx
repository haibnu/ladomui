'use client';

import { useRef } from 'react';
import { IconClose, IconMenu } from '@ladom/icons';
import { Sidebar } from './Sidebar';
import styles from './shell.module.css';

// Below the tablet breakpoint the sidebar moves into a drawer opened from the top bar.
export function MobileNav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  return (
    <>
      <button type="button" className={`${styles.iconButton} ${styles.menuButton}`} onClick={() => dialog.current?.showModal()} aria-label="Open navigation">
        <IconMenu size={20} />
      </button>
      <dialog ref={dialog} className={styles.drawer} onClick={(e) => e.target === dialog.current && close()} aria-label="Navigation">
        <div className={styles.drawerHeader}>
          <span className={styles.navTitle}>Menu</span>
          <button type="button" className={styles.iconButton} onClick={close} aria-label="Close navigation">
            <IconClose size={20} />
          </button>
        </div>
        <Sidebar onNavigate={close} />
      </dialog>
    </>
  );
}
