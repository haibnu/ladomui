'use client';

import { useEffect, useState } from 'react';
import { IconDark, IconLight } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { useLocale } from './useLocale';

export const THEME_KEY = 'ladom-theme';

// Runs before paint (inlined in <head>) so a saved dark theme does not flash light.
export const themeInitScript = `try{if(localStorage.getItem('${THEME_KEY}')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`;

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const { t } = useLocale();

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

  return <Button variant="ghost" tone="secondary" icon={dark ? IconLight : IconDark} onClick={toggle} aria-label={dark ? t.topBar.toLight : t.topBar.toDark} />;
}
