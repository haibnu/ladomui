'use client';

import { useSyncExternalStore } from 'react';
import { CSS_KEY, DEFAULT_THEME, STORAGE_KEY, STYLE_ID, themeCss, type CustomTheme } from './theme';

// One theme for the whole docs site, shared by the header button, the panel and every playground.
// It is applied to the page as a <style> element and data-density on <html>, and kept in
// localStorage (customizeInitScript applies it before paint on the next load).

type State = { theme: CustomTheme; open: boolean };
let state: State = { theme: DEFAULT_THEME, open: false };
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<CustomTheme> | null;
    if (saved) state = { ...state, theme: { ...DEFAULT_THEME, ...saved } };
  } catch {
    // Storage unavailable; start from the default theme.
  }
}

function apply(theme: CustomTheme) {
  const css = themeCss(theme);
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
  if (theme.density === 'narrow') document.documentElement.setAttribute('data-density', 'narrow');
  else document.documentElement.removeAttribute('data-density');
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    localStorage.setItem(CSS_KEY, css);
  } catch {
    // Storage unavailable; the theme still applies to this page.
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function setTheme(patch: Partial<CustomTheme>) {
  load();
  state = { ...state, theme: { ...state.theme, ...patch } };
  apply(state.theme);
  emit();
}

export function setOpen(open: boolean) {
  load();
  state = { ...state, open };
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const serverState: State = { theme: DEFAULT_THEME, open: false };

export function useCustomize() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => serverState,
  );
}
