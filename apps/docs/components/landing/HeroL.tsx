'use client';

import { useState } from 'react';
import styles from './landing.module.css';

// The hero L. Hovering pulls its blocks apart; a click drops them in again (the stack animation
// restarts because its name changes with every click).
export function HeroL({ svg }: { svg: string }) {
  const [round, setRound] = useState(0);
  return (
    <span
      className={styles.heroArt}
      data-art
      data-round={round % 2 ? 'b' : 'a'}
      aria-hidden
      onClick={() => setRound((r) => r + 1)}
      dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg preserveAspectRatio="xMinYMid meet" ') }}
    />
  );
}
