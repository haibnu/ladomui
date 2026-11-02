'use client';

import { useState } from 'react';
import { IconMenu } from '@ladom/icons';
import { Button, Drawer } from '@ladom/ui';
import { Sidebar } from './Sidebar';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

// Below the tablet breakpoint the sidebar moves into a drawer opened from the top bar.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();
  const close = () => setOpen(false);
  return (
    <>
      <Button className={styles.menuButton} variant="ghost" tone="secondary" icon={IconMenu} onClick={() => setOpen(true)} aria-label={t.topBar.openNav} />
      <Drawer side="left" open={open} onClose={close} title={t.topBar.menu} closeLabel={t.topBar.closeNav}>
        <Sidebar onNavigate={close} />
      </Drawer>
    </>
  );
}
