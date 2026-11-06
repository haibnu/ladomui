'use client';

import { useLayoutEffect, type RefObject } from 'react';
import floating from './floating.module.css';

// Inside a <dialog> (Modal, Drawer) the body scrolls, so a panel placed with position: absolute
// next to its anchor would be cut off at the body's edge. There the panel is measured where its CSS
// puts it and pinned to that spot with position: fixed, which no scroll container clips. It is
// measured again on every scroll and resize, so it stays next to its anchor. Elsewhere nothing
// changes. Dialogs sit in the top layer without a transform, so fixed means the viewport.
export function useUnclipped(ref: RefObject<HTMLElement | null>, open: boolean) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!open || !el?.parentElement?.closest('dialog')) return;
    const place = () => {
      el.classList.remove(floating.pinned);
      const r = el.getBoundingClientRect();
      el.style.setProperty('--_pin-top', `${r.top}px`);
      el.style.setProperty('--_pin-left', `${r.left}px`);
      el.style.setProperty('--_pin-width', `${r.width}px`);
      el.classList.add(floating.pinned);
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      el.classList.remove(floating.pinned);
    };
  }, [open, ref]);
}
