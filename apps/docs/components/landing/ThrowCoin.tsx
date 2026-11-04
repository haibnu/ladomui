'use client';

import { useRef, useState } from 'react';
import styles from './landing.module.css';
import { useThrow } from './useThrow';

// A Ladom coin behind the glass button. It turns on its own and can be grabbed and thrown
// around the call-to-action section. The first one carries the "Throw it" hint.
export function ThrowCoin({ svg, className, hint }: { svg: string; className?: string; hint?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [grabbed, setGrabbed] = useState(false);
  useThrow(ref, 'section', () => setGrabbed(true));
  return (
    <span ref={ref} className={`${styles.coin} ${className ?? ""}`} aria-hidden>
      <span className={styles.coinSpin} dangerouslySetInnerHTML={{ __html: svg }} />
      {hint ? <span className={styles.throwHint} data-gone={grabbed || undefined}>{hint}</span> : null}
    </span>
  );
}
