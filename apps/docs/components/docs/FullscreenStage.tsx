'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { IconFullScreen, IconMinimizeScreen } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { useLocale } from '@/components/useLocale';
import styles from './docs.module.css';

/** A playground frame for large components (e.g. AppShell) that can open over the whole window.
 *  Escape or the button brings it back. */
export function FullscreenStage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const { t } = useLocale();
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) setFull(false);
    };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [full]);

  const label = full ? t.component.exitFullscreen : t.component.fullscreen;
  return (
    <div className={styles.fullscreenStage} data-full={full || undefined}>
      <div className={styles.fullscreenBar}>
        <Button variant={full ? 'solid' : 'ghost'} tone="secondary" size="small" iconLeft={full ? IconMinimizeScreen : IconFullScreen} onClick={() => setFull(!full)}>
          {label}
        </Button>
      </div>
      <div className={styles.fullscreenFrame} style={full ? undefined : style}>
        {children}
      </div>
    </div>
  );
}
