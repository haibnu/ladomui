'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Segment } from '@ladom/ui';
import { useLocale } from '../useLocale';

// Component pages have two audiences: designers (anatomy, variants, tokens, Figma) and
// developers (API, code, accessibility). The choice is remembered across pages.
export type View = 'designer' | 'developer';
const VIEW_KEY = 'ladom-docs-view';
export const CONTENT_CHANGE = 'ladom:content-change';

const ViewContext = createContext<{ view: View; setView: (v: View) => void }>({ view: 'designer', setView: () => {} });

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<View>('designer');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      if (saved === 'designer' || saved === 'developer') setViewState(saved);
    } catch {
      // Storage unavailable; keep the default.
    }
  }, []);

  // Let the table of contents re-read the headings after the view changes.
  useEffect(() => {
    window.dispatchEvent(new Event(CONTENT_CHANGE));
  }, [view]);

  const setView = (v: View) => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // Storage unavailable; the choice applies to this page only.
    }
  };

  return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>;
}

export const useView = () => useContext(ViewContext);

export function ViewSwitch() {
  const { view, setView } = useView();
  const { t } = useLocale();
  return (
    <Segment
      aria-label={t.component.viewLabel}
      name="docs-view"
      value={view}
      onChange={(v) => setView(v as View)}
      options={[
        { value: 'designer', label: t.component.designer },
        { value: 'developer', label: t.component.developer },
      ]}
    />
  );
}

/** Renders its children only in the given view. */
export function ForView({ view, children }: { view: View; children: ReactNode }) {
  return useView().view === view ? <>{children}</> : null;
}
