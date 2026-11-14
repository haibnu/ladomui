'use client';

import { useEffect, useState } from 'react';
import { IconDark, IconLight } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { useLocale } from './useLocale';

export const THEME_KEY = 'ladom-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

// Runs before paint (inlined in <head>). A saved choice wins; without one the device setting picks the
// theme. The attribute is always set, so docs styles can key on [data-theme='dark'].
export const themeInitScript = `try{var s=localStorage.getItem('${THEME_KEY}');}catch(e){}document.documentElement.setAttribute('data-theme',s==='dark'||s==='light'?s:matchMedia('${DARK_QUERY}').matches?'dark':'light')`;

const apply = (dark: boolean) => document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
const saved = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    // Until the visitor picks a theme, follow the device when its setting changes.
    const media = matchMedia(DARK_QUERY);
    const follow = () => {
      if (saved()) return;
      apply(media.matches);
      setDark(media.matches);
    };
    media.addEventListener('change', follow);
    return () => media.removeEventListener('change', follow);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    apply(next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      // Storage unavailable (private mode); the theme still applies for this page.
    }
  };

  return <Button variant="ghost" tone="secondary" icon={dark ? IconLight : IconDark} onClick={toggle} aria-label={dark ? t.topBar.toLight : t.topBar.toDark} />;
}
