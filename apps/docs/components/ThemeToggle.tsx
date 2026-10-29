'use client';

import { useEffect, useState } from 'react';
import { IconDark, IconLight } from '@ladom/icons';
import styles from './shell.module.css';

export const THEME_KEY = 'ladom-theme';

// Runs before paint (inlined in <head>) so a saved dark theme does not flash light.
export const themeInitScript = `try{if(localStorage.getItem('${THEME_KEY}')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`;

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => setDark(document.documentElement.getAttribute('data-theme') === 'dark'), []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      // Storage unavailable (private mode); the theme still applies for this page.
    }
  };

  const Icon = dark ? IconLight : IconDark;
  return (
    <button type="button" className={styles.iconButton} onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
      <Icon size={20} />
    </button>
  );
}
