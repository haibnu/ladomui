'use client';

import { useRef } from 'react';
import styles from './landing.module.css';
import { useThrow } from './useThrow';

// The Ladom mark in the footer: grab it and throw it around the footer.
export function FooterMark({ svg, label }: { svg: string; label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useThrow(ref, 'footer');
  return <button ref={ref} type="button" className={styles.footerMark} aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} />;
}
