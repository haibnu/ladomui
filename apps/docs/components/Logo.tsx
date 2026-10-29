import { useId } from 'react';
import styles from './shell.module.css';

// The "UI" badge: a brand-color tile, larger top-right corner, light sheen towards the bottom-right.
// Shared geometry with app/icon.svg (the favicon).
export const BADGE_SHAPE = 'M5 0H21A11 11 0 0 1 32 11V27A5 5 0 0 1 27 32H5A5 5 0 0 1 0 27V5A5 5 0 0 1 5 0Z';
export const BADGE_LETTERS = { u: 'M9.5 9V17.5A4.5 4.5 0 0 0 18.5 17.5V9', i: 'M23.5 9V22' };

export function UiBadge({ className }: { className?: string }) {
  const sheen = useId();
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.35" style={{ stopColor: 'var(--color-static-white-alpha-0)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-static-white-alpha-40)' }} />
        </linearGradient>
      </defs>
      <path d={BADGE_SHAPE} style={{ fill: 'var(--color-static-brand-color)' }} />
      <path d={BADGE_SHAPE} fill={`url(#${sheen})`} />
      <g fill="none" strokeWidth="3.4" strokeLinecap="round" style={{ stroke: 'var(--color-static-white)' }}>
        <path d={BADGE_LETTERS.u} />
        <path d={BADGE_LETTERS.i} />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <span className={styles.logo}>
      Ladom
      <UiBadge className={styles.logoBadge} />
      <span className={styles.visuallyHidden}> UI</span>
    </span>
  );
}
